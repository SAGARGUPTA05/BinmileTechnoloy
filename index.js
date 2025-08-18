require("reflect-metadata");
const express = require("express");
const AppDataSource = require("./data-source");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const Employee = require("./entities/Employee");
const Room = require("./entities/Room");
const Booking = require("./entities/Booking");

AppDataSource.initialize().then(() => {
  console.log("DB connected");

  // Add employee
  app.post("/employees", async (req, res) => {
    const repo = AppDataSource.getRepository(Employee);
    const employee = repo.create(req.body);
    await repo.save(employee);
    res.status(201).json(employee);
  });

  // Add room
  app.post("/rooms", async (req, res) => {
    const repo = AppDataSource.getRepository(Room);
    const room = repo.create(req.body);
    await repo.save(room);
    res.status(201).json(room);
  });

  // Book room
  app.post("/bookings", async (req, res) => {
    try {
      const { employee_id, room_id, start_time, end_time } = req.body;
      const bookingRepo = AppDataSource.getRepository(Booking);

      const now = new Date();

      const startTimeObj = new Date(start_time);
      const endTimeObj = new Date(end_time);

      if (isNaN(startTimeObj) || isNaN(endTimeObj)) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      if (startTimeObj <= now) {
        return res
          .status(400)
          .json({ message: "Start time must be in the future" });
      }

      if (endTimeObj <= startTimeObj) {
        return res
          .status(400)
          .json({ message: "End time must be after start time" });
      }

      const alreadyBooked = await bookingRepo
        .createQueryBuilder("b")
        .where("b.room_id = :room_id", { room_id })
        .andWhere("b.start_time < :end_time", { end_time: endTimeObj })
        .andWhere("b.end_time > :start_time", { start_time: startTimeObj })
        .getOne();

      if (alreadyBooked) {
        return res
          .status(400)
          .json({ message: "Room is already booked in this time slot" });
      }

      const newBooking = bookingRepo.create({
        employee_id,
        room_id,
        start_time: startTimeObj,
        end_time: endTimeObj,
      });

      await bookingRepo.save(newBooking);
      res.status(201).json({ message: "Room booked successfully", newBooking });
    } catch (error) {
      console.error(error); // Debug the actual issue
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get employees with rooms
  app.get("/bookings/rooms", async (req, res) => {
    try {
      const now = new Date();
      const rooms = await AppDataSource.getRepository(Room)
        .createQueryBuilder("r")
        .leftJoinAndSelect("r.bookings", "b")
        .leftJoinAndSelect("b.employee", "e")
        .where("b.end_time >:now", { now })
        .orderBy("b.start_time", "ASC")
        .getMany();

      res.json(
        rooms
          .filter((room) => room.bookings.length > 0) 
          .map((room) => ({
            room_id: room.id,
            room_name: room.name,
            bookings: room.bookings.map((booking) => ({
              booking_id: booking.id,
              booked_by: booking.employee.name,
              start_time: booking.start_time,
              end_time: booking.end_time,
            })),
          }))
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // get bookings for a single employee
  app.get("/bookings/rooms/:employee_id", async (req, res) => {
    try {
      const { employee_id } = req.params;

      const rooms = await AppDataSource.getRepository(Room)
        .createQueryBuilder("r")
        .leftJoinAndSelect("r.bookings", "b")
        .leftJoinAndSelect("b.employee", "e")
        .where("e.id = :employee_id", { employee_id })
        .getMany();

      res.json(
        rooms.map((room) => ({
          room_id: room.id,
          room_name: room.name,
          bookings: room.bookings.map((booking) => ({
            booking_id: booking.id,
            booked_by: booking.employee.name,
            start_time: booking.start_time,
            end_time: booking.end_time,
          })),
        }))
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  //get rooms
  app.get("/get-room", async (req, res) => {
    try {
      const roomRepo = AppDataSource.getRepository(Room);
      const rooms = await roomRepo.find();

      return res.status(200).json({ rooms });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  //get employees
  app.get("/get-employee", async (req, res) => {
    try {
      const empRepo = AppDataSource.getRepository(Employee);
      const rooms = await empRepo.find();

      return res.status(200).json({ rooms });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  // Free rooms
  app.get("/bookings/free-room", async (req, res) => {
    try {
      const bookingRepo = AppDataSource.getRepository(Booking);
      const roomRepo = AppDataSource.getRepository(Room);

      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const bookedRooms = await bookingRepo
        .createQueryBuilder("b")
        .select("b.room_id", "room_id")
        .where("NOW() BETWEEN b.start_time AND b.end_time")
        .getRawMany();

      const bookedRoomIds = bookedRooms.map((r) => r.room_id);

      // Build query for free rooms
      let freeRoomsQuery = roomRepo.createQueryBuilder("room");

      if (bookedRoomIds.length > 0) {
        freeRoomsQuery = freeRoomsQuery.where("room.id NOT IN (:...ids)", {
          ids: bookedRoomIds,
        });
      }

      const freeRooms = await freeRoomsQuery.skip(offset).take(limit).getMany();
      booked;

      res.json({
        page,
        limit,
        total: freeRooms.length,
        data: freeRooms,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  //Delete room  booking
  app.delete("/bookings", async (req, res) => {
    try {
      const { booking_id } = req.body;

      if (!booking_id) {
        return res.status(400).json({ message: "booking_id is required" });
      }

      const bookingRepo = AppDataSource.getRepository(Booking);

      // Find the booking
      const booking = await bookingRepo
        .createQueryBuilder("b")
        .leftJoinAndSelect("b.employee", "employee")
        .leftJoinAndSelect("b.room", "room")
        .where("b.id=:booking_id", { booking_id })
        .getOne();

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Delete the booking
      await bookingRepo.remove(booking);

      res.json({
        message: `Room "${booking.room.name}" previously booked by "${booking.employee.name}" has been deallocated.`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update booking details
  app.put("/bookings", async (req, res) => {
    try {
      const { booking_id, room_id, start_time, end_time } = req.body;
      const bookingRepo = AppDataSource.getRepository(Booking);

      const now = new Date();
      const startTimeObj = new Date(start_time);
      const endTimeObj = new Date(end_time);

      // Validate times
      if (isNaN(startTimeObj) || isNaN(endTimeObj)) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      if (startTimeObj <= now) {
        return res
          .status(400)
          .json({ message: "Start time must be in the future" });
      }
      if (endTimeObj <= startTimeObj) {
        return res
          .status(400)
          .json({ message: "End time must be after start time" });
      }

      // Check if the booking exists
      const existingBooking = await bookingRepo.findOneBy({ id: booking_id });
      if (!existingBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Check if room is already booked in that time slot (excluding this booking)
      const alreadyBooked = await bookingRepo
        .createQueryBuilder("b")
        .where("b.room_id = :room_id", { room_id })
        .andWhere("b.id != :booking_id", { booking_id })
        .andWhere("b.start_time < :end_time", { end_time: endTimeObj })
        .andWhere("b.end_time > :start_time", { start_time: startTimeObj })
        .getOne();

      if (alreadyBooked) {
        return res
          .status(400)
          .json({ message: "Room is already booked in this time slot" });
      }

      // Perform update with validated Date objects
      existingBooking.start_time = startTimeObj;
      existingBooking.end_time = endTimeObj;
      existingBooking.room_id = room_id;

      await bookingRepo.save(existingBooking);

      return res
        .status(200)
        .json({
          message: "Booking updated successfully",
          booking: existingBooking,
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.listen(3000, () => console.log("Server running on port 3000"));
});
