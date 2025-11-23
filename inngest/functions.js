import { db } from "@/configs/db";
import { inngest } from "./client";
import { USER_TABLE } from "@/configs/schema";
import { eq } from 'drizzle-orm';



export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const CreatNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user/new.created" },
  
  async ({ event, step }) => {
    const { user } = event.data;
    // console.log("USER DATA:", user); // Debug incoming payload
    
    // Get event data
    const result = await step.run("create-user-if-not-in-db", async () => {

      // Check if user exists
      const result = await db.select().from(USER_TABLE)
        .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));
      console.log(result);

      if (result?.length == 0) {

        //if not, create user
        const userResp = await db.insert(USER_TABLE).values({
          userName: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,

        }).returning({ id: USER_TABLE.id });
        return userResp;
      }
      return result;
    });
    await step.sleep("wait-a-moment", "1s");
    return "User creation process completed";
  },
);