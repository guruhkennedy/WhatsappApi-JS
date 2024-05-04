
# whatsapp api

for sending message whatsapp


## installation

```bash
>   npm install
```
    
## Running App

To run App, run the following command

```bash
>  npm start
```


## user_table
I forgot to create a sync function to add to the table_user table. please make it yourself

```javascript

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
```


## Screenshots

![App Screenshot](https://i.imgur.com/5VyosIx.png)
## Support

if you have a any question, email kenn@phantom-thieves.org.

