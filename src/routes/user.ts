import { FastifyInstance, RouteShorthandOptions, FastifyReply } from 'fastify'
import { pipe } from 'fp-ts/lib/function'
import { IDeleteUserBody, IUser, IUsers } from '../types/user'
import { UserRepoImpl } from './../repo/user'
import * as TE from 'fp-ts/lib/TaskEither'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
//import { userResponseSchema, usersResponseSchema, postUsersBodySchema } from '../schemas/user'

const UserRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => {
    const userRepo = UserRepoImpl.of()

    interface IdParam {
        id: string
    }

    //   const getUsersResponseSchema: RouteShorthandOptions = {
    //     ...opts,
    //     schema: {
    //       response: {
    //         200: usersResponseSchema
    //       }
    //     }
    //   }

    //   const postUsersOptions = {
    //     ...opts,
    //     schema: {
    //       body: postUsersBodySchema,
    //       response: {
    //         201: userResponseSchema
    //       }
    //     }
    //   }

    server.get('/users', /*getUsersResponseSchema,*/ async (request, reply) => {
        // try {
        //     const users = await userRepo.getUsers()
        //     return reply.status(200).send({ users })
        // } catch (error) {
        //     console.error(`GET /users Error: ${error}`)
        //     return reply.status(500).send(`[Server Error]: ${error}`)
        // }
    })



    server.post<{ Body: IUsers }>('/users', /*postUsersOptions,*/async (request, reply) => {
        const userBodys = request.body
        const addUser = (userBody: IUser): TE.TaskEither<Error, IUser> =>
            pipe(
                userBody.id,
                userRepo.getPhaseById,
                TE.chain(phase =>
                    userRepo.addUser(phase.phase, userBody)
                )
            )
        console.log("12222222", userBodys.users)



        return pipe(
            userBodys.users,
            A.map((x) => addUser(x)),
            A.sequence(TE.MonadTask),
            TE.match(
                (error) => reply.status(500).send({ msg: `${error}` }),
                (user) => reply.status(200).send({ user })
            )
        )()
    })

    server.put<{ Body: IUser }>('/users', opts, async (request, reply) => {
        const userBody = request.body
        return pipe(
            userBody.id,
            userRepo.getPhaseById,
            TE.chain(phase =>
                userRepo.updateUser(phase.phase, userBody),
            ),
            TE.match(
                (error) => reply.status(500).send({ msg: `${error}` }),
                (user) => reply.status(200).send({ user })
            )
        )()


    })

    server.delete<{ Body: IDeleteUserBody }>('/users', opts, async (request, reply) => {
        const userDeleteBody = request.body
        return pipe(
            userRepo.deleteUser(userDeleteBody),
            TE.match(
                (error) => reply.status(500).send({ msg: `${error}` }),
                (users) => reply.status(200).send({ users })
            )
        )()

    })

    done()
}

export { UserRouter }