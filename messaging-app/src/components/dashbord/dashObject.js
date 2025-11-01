import {  List, MessageQueue, UserAdmin } from "@carbon/icons-react";

export const DashBoardObject = [
    {id:1,
    title: "Administration",
    Description: "View Admin Panel",
    icon:UserAdmin,
    actionUrl:"/admin"
    },
    {id:2,
    title: "View Patients",
    Description: "List of all Patients",
    icon:List,
    actionUrl:"/patientList"
    },
    {id:3,
    title:"Talk to Staff Member",
    Description: "Message a Staff Member",
    icon:MessageQueue,
    actionUrl:"/customers"
    },
]