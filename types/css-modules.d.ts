interface CSSModules {
  [className: string]: string;
}

declare module '*.css' {
  var cssModules: CSSModules;
  export default cssModules;
}

declare module '*.scss' {
  var scssModules: CSSModules;
  export default scssModules;
}
