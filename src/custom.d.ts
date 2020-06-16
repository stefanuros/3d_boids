// declare module "*.gltf" {
//   const content: any;
//   export default content;
// }

declare module "*.gltf" {
  const content: any;
  export = content;
}
