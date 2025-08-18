const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: "Employee",
    tableName: "employees",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        },
        position: {
            type: "varchar"
        },
        join_date:{
            type:"timestamp",
            nullable:false
        }
    },
    relations: {
        bookings: {
            type: "one-to-many",
            target: "Booking",
            inverseSide: "employee", // fixed here
            cascade: true
        }
    }
});
