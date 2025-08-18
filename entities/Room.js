const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Room",
    tableName: "rooms",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        capacity: {
            type: "int",
        },
    },
    relations: {
        bookings: {
            type: "one-to-many",
            target: "Booking", // fixed here
            inverseSide: "room", // fixed here
            cascade: true
        }
    }
});
