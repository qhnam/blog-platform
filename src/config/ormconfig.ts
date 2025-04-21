import { DataSource, DataSourceOptions } from 'typeorm';
import { DATA_SOURCE_OPTION } from './data-source-option';

const dataSourceOptions: DataSourceOptions = DATA_SOURCE_OPTION;

module.exports = {
  dataSource: new DataSource(dataSourceOptions),
} as {
  dataSource: DataSource;
};
