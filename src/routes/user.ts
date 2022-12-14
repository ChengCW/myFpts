import { FastifyInstance, RouteShorthandOptions, FastifyReply } from 'fastify'
import { pipe } from 'fp-ts/lib/function'
import { IDeleteUserBody, IUser, IUsers } from '../types/user'
import { UserRepoImpl } from './../repo/user'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import * as A from 'fp-ts/lib/Array'
import * as AP from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either'
import { logInfo } from '../utils/log'
//import { userResponseSchema, usersResponseSchema, postUsersBodySchema } from '../schemas/user'
declare function mergeFn(te: T.Task<E.Either<Error, IUser>[]>): T.Task<Results>
type Results = { errors: Error[]; results: IUser[] };

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
                userRepo.getCountryByCode,
                TE.chain(country =>
                    userRepo.addUser(country.country, userBody)
                )
            )

        function mergeFn(
            a: T.Task<E.Either<Error, IUser>[]>
        ): T.Task<Results> {
            return T.map((e: E.Either<Error, IUser>[]) =>
                e.reduce(
                    (acc, cur) => {
                        // our reducer is still pure, as we pass fresh object literal as initial value
                        if (E.isLeft(cur)) acc.errors.push(cur.left);
                        if (E.isRight(cur)) acc.results.push(cur.right);
                        return acc;
                    },
                    { errors: [], results: [] } as Results
                )
            )(a);
        }
        type Results = { errors: Error[]; results: IUser[] };

        return pipe(
            userBodys.users,
            A.map((x) => addUser(x)),
            A.sequence(T.task), // we use sequenceT here
            mergeFn,
            T.map(
                x => {
                    if (x.errors.length > 0) reply.status(500).send({ msg: `${x.errors}` })
                    if (x.errors.length === 0) reply.status(200).send({ users: x.results })
                }
            )
            //T.chainFirstIOK((x) => () => logInfo(`${x}`)()),
            // userBodys.users,
            // A.map((x) => addUser(x)),
            // A.sequence(TE.MonadTask),

            // TE.match(
            //     (error) => reply.status(500).send({ msg: `${error}` }),
            //     (user) => reply.status(200).send({ user })
            // ),
            // T.chainFirstIOK(() => () => logInfo(`Add User`)()),

        )()
    })

    server.put<{ Body: IUser }>('/users', opts, async (request, reply) => {
        const userBody = request.body
        return pipe(
            userBody.id,
            userRepo.getCountryByCode,
            TE.chain(country =>
                userRepo.updateUser(country.country, userBody),
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