import { Sequelize, Model, DataTypes } from "sequelize";

import { IUser } from "../types/user";
export class User extends Model<IUser> implements IUser {
    id!: string;
    name!: string;
    email!: string;
    claimTime!: Date;

}
export const UserFactory = (sequelize: Sequelize): typeof User => {

    User.init(
        {
            id: {
                type: DataTypes.STRING(150),
                allowNull: false,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(100),
            },
            claimTime: {
                type: DataTypes.DATE,
            }
        },
        {
            sequelize,
            modelName: "User",
            timestamps: true,
            updatedAt: 'claimTime',
            createdAt: false,
            freezeTableName: true
        }
    );
    return User;
};