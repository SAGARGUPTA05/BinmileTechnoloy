module.exports = class InitSchema1712879999999 {
    name = 'InitSchema1712879999999'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "employees" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "position" VARCHAR NOT NULL,
                "join_date" TIMESTAMP NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "rooms" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "capacity" INT NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "bookings" (
                "id" SERIAL PRIMARY KEY,
                "employee_id" INT NOT NULL,
                "room_id" INT NOT NULL,
                "start_time" TIMESTAMP NOT NULL,
                "end_time" TIMESTAMP NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_employee" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_room" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP TABLE "employees"`);
    }
}
