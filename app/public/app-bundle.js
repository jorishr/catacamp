/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/public/scripts/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/public/scripts/main.js":
/*!************************************!*\
  !*** ./app/public/scripts/main.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_copyurl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/copyurl */ \"./app/public/scripts/modules/copyurl.js\");\n/* harmony import */ var _modules_copyurl__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_modules_copyurl__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _modules_pwvisibility__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/pwvisibility */ \"./app/public/scripts/modules/pwvisibility.js\");\n/* harmony import */ var _modules_pwvisibility__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_modules_pwvisibility__WEBPACK_IMPORTED_MODULE_1__);\n\n\n_modules_copyurl__WEBPACK_IMPORTED_MODULE_0___default()();\n_modules_pwvisibility__WEBPACK_IMPORTED_MODULE_1___default()();\n\n//# sourceURL=webpack:///./app/public/scripts/main.js?");

/***/ }),

/***/ "./app/public/scripts/modules/copyurl.js":
/*!***********************************************!*\
  !*** ./app/public/scripts/modules/copyurl.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("//  copy current page url to clipboard and show a tooltip confirmation\nvar dummy = document.createElement('input'),\n    text = window.location.href,\n    shareBtn = document.getElementsByClassName('share-link'),\n    tooltip = document.getElementsByClassName('tooltip-link');\n/*  check if page has share btns via class added to the body on that page   */\n\nfunction addCopyUrl() {\n  if (document.body.classList.contains('hasShare')) {\n    shareBtn[0].addEventListener('click', function (event) {\n      document.body.appendChild(dummy);\n      dummy.value = text;\n      dummy.select();\n      document.execCommand('copy');\n      document.body.removeChild(dummy);\n      tooltip[0].classList.add('tooltip-link--visible');\n      setTimeout(function () {\n        tooltip[0].classList.remove('tooltip-link--visible');\n      }, 3000);\n    });\n  }\n\n  ;\n}\n\n;\nmodule.exports = addCopyUrl;\n\n//# sourceURL=webpack:///./app/public/scripts/modules/copyurl.js?");

/***/ }),

/***/ "./app/public/scripts/modules/pwvisibility.js":
/*!****************************************************!*\
  !*** ./app/public/scripts/modules/pwvisibility.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*  toggle password visibility and change the icon \r\n    note: some forms have two pwfields (confirmation)   */\nvar icons = document.querySelectorAll('.password-box__icon');\n\nfunction passwordToggle() {\n  if (document.body.classList.contains('hasPw')) {\n    var _loop = function _loop(i) {\n      icons[i].addEventListener('click', function () {\n        if (icons[i].previousElementSibling.type === 'password') {\n          icons[i].previousElementSibling.type = 'text';\n          icons[i].classList.remove('fa-eye');\n          icons[i].classList.add('fa-eye-slash');\n        } else {\n          icons[i].previousElementSibling.type = 'password';\n          icons[i].classList.remove('fa-eye-slash');\n          icons[i].classList.add('fa-eye');\n        }\n\n        ;\n      });\n    };\n\n    for (var i = 0; i < icons.length; i++) {\n      _loop(i);\n    }\n\n    ;\n  }\n}\n\n;\nmodule.exports = passwordToggle;\n\n//# sourceURL=webpack:///./app/public/scripts/modules/pwvisibility.js?");

/***/ })

/******/ });