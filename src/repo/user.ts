import { IDeleteUserBody, IQueryPhaseResult, IUser } from './../types/user'
import { DB } from './../plugins/sequelize'
import { Op, QueryTypes, Sequelize } from 'sequelize'

import { User } from '../models/user'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'

import * as A from 'fp-ts/Array'
import * as S from 'fp-ts/string'
import * as M from 'fp-ts/Map'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

interface UserRepo {
    getUsers(phase: string): Promise<Array<IUser> | null>
    addUser(phase: string, userBody: IUser): TE.TaskEither<Error, IUser>
    updateUser(phase: string, userBody: IUser): TE.TaskEither<Error, IUser>
    deleteUser(deleteUserBody: IDeleteUserBody): TE.TaskEither<Error, IUser[]>
    getPhaseById(id: string): TE.TaskEither<Error, IQueryPhaseResult>
    getUsefulModel(phase: string): TE.TaskEither<Error, typeof User>
}

class UserRepoImpl implements UserRepo {
    private constructor() { }

    static of(): UserRepoImpl {
        return new UserRepoImpl()
    }
    getUsefulModel = (phase: string): TE.TaskEither<Error, typeof User> => pipe(
        DB.userModel.get(phase),
        O.fromNullable,
        O.match(
            () => TE.left(new Error('Can not find corresponding database config')),
            (x) => TE.right(x)
        ),
    )

    async getUsers(phase: string): Promise<Array<IUser> | null> {
        const model = DB.userModel.get(phase)
        return model ? model.findAll() : null
    }

    addUser(phase: string, userBody: IUser): TE.TaskEither<Error, IUser> {
        const addUserTryCatch = (model: typeof User): TE.TaskEither<Error, IUser> => {
            return pipe(
                TE.tryCatch(
                    () => model.create(userBody),
                    (error) => new Error(`Cnt not add user:${error}`)
                ),
                TE.chain(x => x ?
                    TE.right(x)
                    : TE.left(new Error(`Can not find object`))
                ))
        }

        const process = pipe(

            this.getUsefulModel(phase),
            TE.chain(x => addUserTryCatch(x))

        )

        console.log(process)

        return process
    }

    updateUser(phase: string, userBody: IUser): TE.TaskEither<Error, IUser> {

        const where = {
            where: {
                id: userBody.id
            }
        }

        const updateUserTryCatch = (model: typeof User): TE.TaskEither<Error, IUser> => {
            return pipe(
                TE.tryCatch(
                    () => model.update(userBody, where),
                    (error) => new Error(`Cnt not update user:${error}`)
                ),
                TE.chain(x => x ?
                    getUserTryCatch(model)
                    : TE.left(new Error(`Can not find object`))
                ))
        }

        const getUserTryCatch = (model: typeof User): TE.TaskEither<Error, IUser> => {
            return pipe(
                TE.tryCatch(
                    () => model.findOne(where),
                    (error) => new Error(`${error}`)
                ),
                TE.chain((userResult) => userResult ? TE.right(userResult as IUser) : TE.left(new Error(`Can not find object`)))
            )
        }


        const process = pipe(


            // DB.userModel.get(phase),
            // O.fromNullable,
            // O.match(
            //     () => TE.left(new Error('XXXX')),
            //     (x) => {
            //         console.log(x)
            //         return updateUserTryCatch(x)
            //     }
            // ),
            this.getUsefulModel(phase),
            TE.chain(x => updateUserTryCatch(x))

        )

        console.log(process)

        return process
    }

    deleteUser(deleteUserBody: IDeleteUserBody): TE.TaskEither<Error, IUser[]> {

        const where = {
            where: {
                id: {
                    [Op.in]: deleteUserBody.ids.map((id) => id)
                }
            }
        }
        const getUserTryCatch = (model: typeof User): TE.TaskEither<Error, IUser[]> => {
            return pipe(
                TE.tryCatch(
                    () => model.findAll(where),
                    (error) => new Error(`${error}`)
                ),
                TE.chain((userResult) => userResult ? TE.right(userResult as IUser[])
                    : TE.left(new Error(`Can not find objects that will be deleted`)))
            )
        }
        const deleteUserTryCatch = (model: typeof User): TE.TaskEither<Error, number> => {
            return pipe(
                TE.tryCatch(
                    () => model.destroy(where),
                    (error) => new Error(`Cnt not delete user:${error}`)
                ),
                TE.chain(x => x >= 0 ?
                    TE.right(x)
                    : TE.left(new Error(`Can not delete object`))
                ))
        }
        const run = pipe(
            TE.Do,
            TE.bind('getModel', () => this.getUsefulModel(deleteUserBody.phase)),
            TE.bind('getUsers', ({ getModel }) => getUserTryCatch(getModel))

        )
        const process = pipe(
            run,
            TE.chain(x => pipe(
                deleteUserTryCatch(x.getModel),
                TE.chain(deleteNumber => deleteNumber > 0 ? TE.right(x.getUsers) : TE.left(new Error(`Can not delete any object`)))
            )
            )
        )

        console.log(process)

        return process

    }

    getPhaseById(id: string): TE.TaskEither<Error, IQueryPhaseResult> {

        const getAvailableSeqConnOrNull = (m: Map<string, Sequelize>): O.Option<Sequelize> => pipe(
            M.keys(S.Ord)(m),
            A.head,
            O.map(x => m.get(x)),
            O.chain(O.fromNullable)
        )
        const queryPhaseSql = (s: Sequelize): TE.TaskEither<Error, IQueryPhaseResult> => {
            return pipe(
                TE.tryCatch(
                    () => s.query(sql, { type: QueryTypes.SELECT, plain: true }),
                    (error) => new Error(`${error}`)
                ),
                TE.chain((queryResult) => queryResult ? TE.right(queryResult as IQueryPhaseResult) : TE.left(new Error(`Can not find phase`)))
            )
        }
        const sql = "SELECT `phase` FROM `testdb`.`Phase` WHERE (`id` = 'haha') ORDER BY `id` LIMIT 1 OFFSET 0;"
        return pipe(
            getAvailableSeqConnOrNull(DB.conn),
            O.match(
                () => TE.left(new Error('Can not find available db connection')),
                x => queryPhaseSql(x))
        )
    }
}

export { UserRepoImpl }