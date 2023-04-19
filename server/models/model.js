const { sequelize } = require(".")

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })
  return User;
}

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  })
  return Project;
}

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      }
    }
  })
  return Task;
}

module.exports = (sequelize, DataTypes) => {
  const Bug = sequelize.define('bug', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id',
      }
    }
  })
  return Bug;
}


module.exports = (sequelize, DataTypes) => {
  const UserProject = sequelize.define('userProject', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'projects',
        key: 'id',
      }
    }
  });
  return UserProject;
};



