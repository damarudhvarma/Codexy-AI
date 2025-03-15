import { mongoose } from "mongoose";



const conn = ()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("DB connected");
    }).catch((err)=>{    
        console.log("DB connection error",err);
    }
    );

        
}

export default conn;