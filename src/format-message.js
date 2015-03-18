import MessageFormat from 'message-format'

let
	formats = MessageFormat.data.formats,
	cache = formats.cache,
	options = {
		enableCache: true,
		locale: 'en',
		translate(pattern) {
			return pattern
		}
	}


function cached(key, fn) {
	if (options.enableCache && key in cache) {
		return cache[key]
	} else {
		let value = fn()
		if (options.enableCache) {
			cache[key] = value
		}
		return value
	}
}


function formatMessage(pattern, args, locale) {
	locale = locale || options.locale
	let
		key = locale + ':format:' + pattern,
		func = cached(key, function() {
			let localPattern = options.translate(pattern, locale)
			return new MessageFormat(localPattern, locale, { cache:options.enableCache }).format
		})
	return func(args)
}


formatMessage.setup = function({ cache, locale, translate }={}) {
	options.enableCache = 'boolean' === typeof cache ? cache : options.enableCache
	options.locale = locale || options.locale
	options.translate = translate || options.translate
}


formatMessage.number = function(locale, num, style='medium') {
	let
		key = locale + ':number:' + style,
		func = cached(key, function() {
			return new Intl.NumberFormat(locale, formats.number[style]).format
		})
	return func(num)
}


formatMessage.date = function(locale, date, style='medium') {
	let
		key = locale + ':date:' + style,
		func = cached(key, function() {
			return new Intl.DateTimeFormat(locale, formats.date[style]).format
		})
	return func(date)
}


formatMessage.time = function(locale, date, style='medium') {
	let
		key = locale + ':time:' + style,
		func = cached(key, function() {
			return new Intl.DateTimeFormat(locale, formats.time[style]).format
		})
	return func(date)
}


export default formatMessage
