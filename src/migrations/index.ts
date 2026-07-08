import { QueryInterface, DataTypes } from 'sequelize';

type Migration = {
  name: string;
  up: (queryInterface: QueryInterface) => Promise<void>;
};

const tableExists = async (queryInterface: QueryInterface, tableName: string) => {
  const tables = await queryInterface.showAllTables();
  return tables.some((table) => {
    if (typeof table === 'string') return table === tableName;
    return (table as { tableName?: string }).tableName === tableName;
  });
};

const createTableIfMissing = async (
  queryInterface: QueryInterface,
  tableName: string,
  attributes: Parameters<QueryInterface['createTable']>[1]
) => {
  if (await tableExists(queryInterface, tableName)) {
    return;
  }

  await queryInterface.createTable(tableName, attributes);
};

const timestamps = {
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
};

const initialSchemaMigration: Migration = {
  name: '001-initial-schema',
  up: async (queryInterface) => {
    await createTableIfMissing(queryInterface, 'Roles', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      ...timestamps
    });

    await createTableIfMissing(queryInterface, 'Users', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      email: { type: DataTypes.STRING, allowNull: true },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      refreshToken: { type: DataTypes.STRING, allowNull: true },
      allowedScreens: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Roles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ...timestamps
    });

    await createTableIfMissing(queryInterface, 'Feedbacks', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'New' },
      ...timestamps
    });

    await createTableIfMissing(queryInterface, 'Donations', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      paymentReference: { type: DataTypes.STRING, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: true },
      ...timestamps
    });

    await createTableIfMissing(queryInterface, 'VehicleTypes', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      orderIndex: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      ...timestamps
    });

    await createTableIfMissing(queryInterface, 'ServiceTypes', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      orderIndex: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      ...timestamps
    });

    await createTableIfMissing(queryInterface, 'Mechanics', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      mechanicType: {
        type: DataTypes.ENUM('Individual Mechanic', 'Workshop / Garage', 'Authorized Service Center', 'Mobile Mechanic', 'Towing Company', 'Fuel Delivery Partner'),
        allowNull: false,
        defaultValue: 'Workshop / Garage'
      },
      name: { type: DataTypes.STRING, allowNull: true },
      businessName: { type: DataTypes.STRING, allowNull: true },
      mechanicName: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      phone: { type: DataTypes.JSON, allowNull: false },
      emails: { type: DataTypes.JSON, allowNull: true },
      vehicleTypes: { type: DataTypes.JSON, allowNull: false },
      serviceTypes: { type: DataTypes.JSON, allowNull: false },
      serviceRadius: { type: DataTypes.INTEGER, allowNull: true },
      evSupport: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      homeService: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      roadsideAssistance: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      is24Hours: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      holidayWorking: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      latitude: { type: DataTypes.FLOAT, allowNull: false },
      longitude: { type: DataTypes.FLOAT, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      landmark: { type: DataTypes.STRING, allowNull: true },
      area: { type: DataTypes.STRING, allowNull: true },
      city: { type: DataTypes.STRING, allowNull: true },
      state: { type: DataTypes.STRING, allowNull: true },
      country: { type: DataTypes.STRING, allowNull: true },
      operatingDays: { type: DataTypes.JSON, allowNull: true },
      operatingHours: { type: DataTypes.STRING, allowNull: true },
      availability: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      image: { type: DataTypes.STRING, allowNull: true },
      websiteUrl: { type: DataTypes.STRING, allowNull: true },
      rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Inactive'),
        allowNull: false,
        defaultValue: 'Pending'
      },
      createdById: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      approvedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ...timestamps
    });

    await createTableIfMissing(queryInterface, 'MechanicUpdateRequests', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      updatedData: { type: DataTypes.JSON, allowNull: false },
      status: {
        type: DataTypes.ENUM('Pending Update Approval', 'Approved', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending Update Approval'
      },
      mechanicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Mechanics', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      requestedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      reviewedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ...timestamps
    });

    await createTableIfMissing(queryInterface, 'ActivityLogs', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      action: { type: DataTypes.STRING, allowNull: false },
      details: { type: DataTypes.TEXT, allowNull: true },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ...timestamps
    });
  }
};

export const migrations: Migration[] = [initialSchemaMigration];
