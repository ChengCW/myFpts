import { Sequelize } from "sequelize";   // 引入 sequelize
import { User, UserFactory } from "../models/user";

let DB: {
    conn: Map<string, Sequelize>
    userModel: Map<string, typeof User>

}
// 填入對應的資料庫帳號


const createSequelizeConn = () => {
    const sequelize = new Sequelize('testdb', 'root', 'my-secret-pw', {
        host: 'localhost',
        port: 13306,
        dialect: 'mariadb'
    });
    DB = {
        conn: new Map([['P1', sequelize]]),
        userModel: new Map([['P1', UserFactory(sequelize)]])
    }
}


export { DB, createSequelizeConn }