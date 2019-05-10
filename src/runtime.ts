const { define } = require('./require');

const d = (name: string, exports: any) =>
  define(name, function(_1: any, _2: any, module: any) {
    module.exports = exports;
  });

d('@babel/runtime/regenerator', require('@babel/runtime/regenerator'));
d('regenerator-runtime', require('regenerator-runtime'));

const helpers: any = {
  AsyncGenerator: require('@babel/runtime/helpers/AsyncGenerator'),
  AwaitValue: require('@babel/runtime/helpers/AwaitValue'),
  applyDecoratedDescriptor: require('@babel/runtime/helpers/applyDecoratedDescriptor'),
  arrayWithHoles: require('@babel/runtime/helpers/arrayWithHoles'),
  arrayWithoutHoles: require('@babel/runtime/helpers/arrayWithoutHoles'),
  assertThisInitialized: require('@babel/runtime/helpers/assertThisInitialized'),
  asyncGeneratorDelegate: require('@babel/runtime/helpers/asyncGeneratorDelegate'),
  asyncIterator: require('@babel/runtime/helpers/asyncIterator'),
  asyncToGenerator: require('@babel/runtime/helpers/asyncToGenerator'),
  awaitAsyncGenerator: require('@babel/runtime/helpers/awaitAsyncGenerator'),
  classCallCheck: require('@babel/runtime/helpers/classCallCheck'),
  classNameTDZError: require('@babel/runtime/helpers/classNameTDZError'),
  classPrivateFieldGet: require('@babel/runtime/helpers/classPrivateFieldGet'),
  classPrivateFieldLooseBase: require('@babel/runtime/helpers/classPrivateFieldLooseBase'),
  classPrivateFieldLooseKey: require('@babel/runtime/helpers/classPrivateFieldLooseKey'),
  classPrivateFieldSet: require('@babel/runtime/helpers/classPrivateFieldSet'),
  classStaticPrivateFieldSpecGet: require('@babel/runtime/helpers/classStaticPrivateFieldSpecGet'),
  classStaticPrivateFieldSpecSet: require('@babel/runtime/helpers/classStaticPrivateFieldSpecSet'),
  construct: require('@babel/runtime/helpers/construct'),
  createClass: require('@babel/runtime/helpers/createClass'),
  decorate: require('@babel/runtime/helpers/decorate'),
  defaults: require('@babel/runtime/helpers/defaults'),
  defineEnumerableProperties: require('@babel/runtime/helpers/defineEnumerableProperties'),
  defineProperty: require('@babel/runtime/helpers/defineProperty'),
  extends: require('@babel/runtime/helpers/extends'),
  get: require('@babel/runtime/helpers/get'),
  getPrototypeOf: require('@babel/runtime/helpers/getPrototypeOf'),
  inherits: require('@babel/runtime/helpers/inherits'),
  inheritsLoose: require('@babel/runtime/helpers/inheritsLoose'),
  initializerDefineProperty: require('@babel/runtime/helpers/initializerDefineProperty'),
  initializerWarningHelper: require('@babel/runtime/helpers/initializerWarningHelper'),
  instanceof: require('@babel/runtime/helpers/instanceof'),
  interopRequireDefault: require('@babel/runtime/helpers/interopRequireDefault'),
  interopRequireWildcard: require('@babel/runtime/helpers/interopRequireWildcard'),
  isNativeFunction: require('@babel/runtime/helpers/isNativeFunction'),
  iterableToArray: require('@babel/runtime/helpers/iterableToArray'),
  iterableToArrayLimit: require('@babel/runtime/helpers/iterableToArrayLimit'),
  iterableToArrayLimitLoose: require('@babel/runtime/helpers/iterableToArrayLimitLoose'),
  jsx: require('@babel/runtime/helpers/jsx'),
  newArrowCheck: require('@babel/runtime/helpers/newArrowCheck'),
  nonIterableRest: require('@babel/runtime/helpers/nonIterableRest'),
  nonIterableSpread: require('@babel/runtime/helpers/nonIterableSpread'),
  objectDestructuringEmpty: require('@babel/runtime/helpers/objectDestructuringEmpty'),
  objectSpread: require('@babel/runtime/helpers/objectSpread'),
  objectWithoutProperties: require('@babel/runtime/helpers/objectWithoutProperties'),
  objectWithoutPropertiesLoose: require('@babel/runtime/helpers/objectWithoutPropertiesLoose'),
  possibleConstructorReturn: require('@babel/runtime/helpers/possibleConstructorReturn'),
  readOnlyError: require('@babel/runtime/helpers/readOnlyError'),
  set: require('@babel/runtime/helpers/set'),
  setPrototypeOf: require('@babel/runtime/helpers/setPrototypeOf'),
  skipFirstGeneratorNext: require('@babel/runtime/helpers/skipFirstGeneratorNext'),
  slicedToArray: require('@babel/runtime/helpers/slicedToArray'),
  slicedToArrayLoose: require('@babel/runtime/helpers/slicedToArrayLoose'),
  superPropBase: require('@babel/runtime/helpers/superPropBase'),
  taggedTemplateLiteral: require('@babel/runtime/helpers/taggedTemplateLiteral'),
  taggedTemplateLiteralLoose: require('@babel/runtime/helpers/taggedTemplateLiteralLoose'),
  temporalRef: require('@babel/runtime/helpers/temporalRef'),
  temporalUndefined: require('@babel/runtime/helpers/temporalUndefined'),
  toArray: require('@babel/runtime/helpers/toArray'),
  toConsumableArray: require('@babel/runtime/helpers/toConsumableArray'),
  toPropertyKey: require('@babel/runtime/helpers/toPropertyKey'),
  typeof: require('@babel/runtime/helpers/typeof'),
  wrapAsyncGenerator: require('@babel/runtime/helpers/wrapAsyncGenerator'),
  wrapNativeSuper: require('@babel/runtime/helpers/wrapNativeSuper')
};

for (const key in helpers) {
  if (helpers.hasOwnProperty(key)) {
    d(`@babel/runtime/helpers/${key}`, helpers[key]);
  }
}
