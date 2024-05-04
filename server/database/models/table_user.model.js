import { DataTypes } from "sequelize";
import { sequelize } from "../../config/Database.js";

const UserModel = sequelize.define(
    "User",
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        user_email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        user_password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    { tableName: "table_user", timestamps: true }
);

export default UserModel;