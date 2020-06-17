declare module "*.gltf" {
  const content: any;
  export = content;
}

declare module "*.json" {
  const content: {[key: string]: any};
  export = content;
}
