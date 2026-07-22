import "sequelize";

declare module "sequelize" {
  interface Model {
    // Legacy `sequelize.define` models gain their fields dynamically at runtime.
    [attribute: string]: any;
  }
}
