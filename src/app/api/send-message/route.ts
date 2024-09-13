/* eslint-disable @typescript-eslint/no-unused-vars */
import UserModel,{ Message } from "@/model/User"
import dbConnect from "@/lib/dbConnect"

export async function POST(request : Request){
    await dbConnect();
    
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne(
            username,
        ).exec();

        if(!user){
            return Response.json(
                {
                    message : "User not found",
                    success : false,
                },
                {
                    status : 404,
                }
            )
        }

        if(!user.isAcceptingMessages){
            return Response.json(
                {
                    message : "User is not accepting messages",
                    success : false,
                },
                {
                    status : 404,
                }
            )
        }

        const newMessage = { content, createdAt : new Date() };
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            {
                message : "Message Sent Succefssfully",
                success : true,
            },
            {
                status : 201,
            }
        );
    }catch(error){
        console.error('Error adding message:', error);
        return Response.json(
            {
                message : "Internal Server Error",
                success : false
            },
            {
                status : 500
            }
        )
    }
}