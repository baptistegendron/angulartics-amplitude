## angulartics-amplitude
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-downloads-url] [![Bower version][bower-image]][bower-url] [![MIT license][license-image]][license-url]

Amplitude plugin for [Angulartics](http://github.com/angulartics).

## Install
First make sure you've read installation and setup instructions for [Angulartics](http://angulartics.github.io/).

Then you can install this package either with `npm` or with `bower`.

### npm

```shell
npm install angulartics-amplitude
```

Then add `angulartics.amplitude` as a dependency for your app:

```javascript
require('angulartics')

angular.module('myApp', [
  'angulartics', 
  require('angulartics-amplitude')
]);
```

### bower
```shell
bower install angulartics-amplitude
```

Add the `<script>` to your `index.html`:

```html
<script src="/bower_components/angulartics-amplitude/dist/angulartics-amplitude.min.js"></script>
```

Then add `angulartics.amplitude` as a dependency for your app:

```javascript
angular.module('myApp', ['angulartics','angulartics.amplitude']);
```

## Documentation
* This plugin includes the snippet code provided by Amplitude.
<br>
* Init your api key in your app .config():
```javascript
var myApp = angular.module('myApp',[]);

myApp.config(['$analytics_amplitudeProvider', function($analytics_amplitudeProvider) {
    $analytics_amplitudeProvider.init("API_KEY");
    // OR
    $analytics_amplitudeProvider.initWithProject("ProjectName", "API_KEY");
}]);
```

If needed, you can access the Amplitude object by injecting '$analytics_amplitude'. For instance:
```javascript
myApp.run(['$analytics_amplitude', function($analytics_amplitude) {
    $analytics_amplitude.getInstance()...
}])
```
Check [Amplitude documentation](https://amplitude.zendesk.com/hc/en-us/articles/115001361248) for more details.
<br>
* Tracking Event, Pages and setting user properties are done through '$analytics' service.
This angulartics plugin supports the following analytics calls:
```javascript
$analytics.pageTrack()
$analytics.eventTrack()
$analytics.setOptOut()
$analytics.setUsernames()
$analytics.setUserProperties()
$analytics.setUserPropertiesOnce()
```

Check [Angulartics documentation](https://github.com/angulartics/angulartics) for more details.

## Development

```shell
npm run build
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/angulartics-amplitude.svg
[npm-url]: https://npmjs.org/package/angulartics-amplitude
[npm-downloads-image]: https://img.shields.io/npm/dm/angulartics-amplitude.svg
[npm-downloads-url]: https://npmjs.org/package/angulartics-amplitude
[bower-image]: https://img.shields.io/bower/v/angulartics-amplitude.svg
[bower-url]: http://bower.io/search/?q=angulartics-amplitude
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE