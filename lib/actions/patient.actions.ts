import { ID, Query } from "node-appwrite"
import { users } from "../appwrite.config"

export const createUser = async (user: CreateUserParams) => {
    try {
        console.log('try called createUser: ', users)
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
        console.log(newUser, 'result')
    } catch (error: any) {
        console.log(error,'error')
        if (error && error?.code === 409) {
            const doocument = await users.list([Query.equal('email', [user.email])])
            return doocument?.users[0];
        }

    }
}