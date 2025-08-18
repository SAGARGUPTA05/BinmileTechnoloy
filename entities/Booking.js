const {EntitySchema, JoinColumn}=require('typeorm')
const Room = require('./Room')

module.exports=new EntitySchema({

    name:"Booking",
    tableName:"bookings",
    columns:{
        id:{
            primary:true,
            type:"int",
            generated:true
        },
        employee_id :{
            type:"int"
        },
        room_id:{
            type:"int"
        },
        start_time:{
            type:"timestamp",
            nullable:false
        },
        end_time:{
            type:"timestamp",
            nullable:false
        }
        ,created_at:{
            type:"timestamp",
            createDate:true
        }
    },
    relations:{
        employee:{
            type:"many-to-one",
            target:"Employee",
            joinColumn:{name:"employee_id"},
            onDelete:"CASCADE"
        }
        ,
        room:{
            type:"many-to-one",
            target:"Room",
            joinColumn:{name:"room_id"},
            onDelete:"CASCADE"
        }
    }
})