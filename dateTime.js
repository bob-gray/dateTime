// dateTime v1
// author: Bob Gray <gray.bob98@gmail.com>
// Adapted from Steven Levithan <stevenlevithan.com> Date Format 1.2.3 (c) 2007-2009

/**
 * Date object manipulation. Note: date objects in Javascript are essentially timestamps with some baked
 * in methods - hence the name "dateTime" as opposed to "date".
 * @module dateTime
 */

/**
 * Date object manipulation.
 * @class dateTime
 * @static
 */

( function ( global ) {

	if ( global.dateTime ) return;

	global.dateTime = {

		/**
		 * Adds/subtracts units of time to/from a Date object. This method alters the original date object.
		 * @method move
		 * @param {Date} date Date to be altered. Can be a string representing a date.
		 * @param {number} units Amount to move the date. Negative number move it back.
		 * @param {string} part Represents a date/time part.
		 * Valid options include:
		 * d: day,
		 * w: week,
		 * m: month,
		 * q: quarter,
		 * y: year,
		 * h: hour,
		 * M: minutes,
		 * s: seconds,
		 * l: milliseconds
		 * @return {date} date
		 */

		move: function () {

			// Date ( time ) methods
			var D = global.Date,
				DateProto = D.prototype,

				//setters
				_setDate = DateProto.setUTCDate,
				_setMonth = DateProto.setUTCMonth,
				_setFullYear = DateProto.setUTCFullYear,

				_setMilliseconds = DateProto.setUTCMilliseconds,
				_setSeconds = DateProto.setUTCSeconds,
				_setMinutes = DateProto.setUTCMinutes,
				_setHours = DateProto.setUTCHours,

				// getters
				_getDate = DateProto.getUTCDate,
				_getMonth = DateProto.getUTCMonth,
				_getFullYear = DateProto.getUTCFullYear,

				_getMilliseconds = DateProto.getUTCMilliseconds,
				_getSeconds = DateProto.getUTCSeconds,
				_getMinutes = DateProto.getUTCMinutes,
				_getHours = DateProto.getUTCHours,

				movers = {

					d: function ( date, units ) {
						_setDate.call( date, _getDate.call( date ) + units );
						},

					w: function ( date, units ) {
						_setDate.call( date, _getDate.call( date ) + units * 7 );
						},

					m: function ( date, units ) {
						_setMonth.call( date, _getMonth.call( date ) + units );
						},

					q: function ( date, units ) {
						_setMonth.call( date, _getMonth.call( date ) + units * 3 );
						},

					y: function ( date, units ) {
						_setFullYear.call( date, _getFullYear.call( date ) + units );
						},

					h: function ( date, units ) {
						_setHours.call( date, _getHours.call( date ) + units );
						},

					M: function ( date, units ) {
						_setMinutes.call( date, _getMinutes.call( date ) + units );
						},

					s: function ( date, units ) {
						_setSeconds.call( date, _getSeconds.call( date ) + units );
						},

					l: function ( date, units ) {
						_setMilliseconds.call( date, _getMilliseconds.call( date ) + units );
						}

					},

				move = dateTime.move = function ( date, units, part ) {

					// new Date if not instance of Date
					date instanceof D || ( date = new D( date ) );

					// get date part and add/subtract units
					movers[ part ]( date, units );

					return date;
					};

			return move.apply( null, arguments );
			},


		/**
		 * Determines the integer number of units by which dateA is less than dateB
		 * @method compare
		 * @param {Date} dateA
		 * @param {Date} dateB
		 * @param {string} part Represents a date/time part.
		 * Valid options include:
		 * d: day,
		 * w: week,
		 * m: month,
		 * q: quarter,
		 * y: year
		 * @return {integer} units of difference
		 */

		compare: function () {

			// Date ( time ) methods
			var D = global.Date,
				DateProto = D.prototype,

				// setters
				_setHours = DateProto.setHours,

				// getters
				_getDate = DateProto.getDate,
				_getMonth = DateProto.getMonth,
				_getFullYear = DateProto.getFullYear,

				_getSeconds = DateProto.getSeconds,
				_getMinutes = DateProto.getMinutes,
				_getHours = DateProto.getHours,
				_getOffset = DateProto.getTimezoneOffset,

				comparers = {

					l: function ( dateA, dateB ) {
						return dateB - dateA;
						},

					s: function ( dateA, dateB ) {
						var seconds = _getSeconds;
						return comparers.M( dateA, dateB ) * 60 + seconds.call( dateB ) - seconds.call( dateA );
						},

					M: function ( dateA, dateB ) {
						var minutes = _getMinutes;
						return comparers.h( dateA, dateB ) * 60 + minutes.call( dateB ) - minutes.call( dateA );
						},

					h: function ( dateA, dateB ) {
						var hours = _getHours;
						return comparers.d( dateA, dateB ) * 24 + hours.call( dateB ) - hours.call( dateA );
						},

					d: function ( dateA, dateB  ) {
						var setHours = _setHours,
							offset = _getOffset,
							compensation = ( offset.call( dateB ) - offset.call( dateA ) ) * 60000;
						// ~~ faster than Math.floor
						return ~~(( setHours.call( new D( dateB ), 0 ) - setHours.call( new D( dateA ), 0 ) + compensation ) / 86400000 );
						},

					w: function ( dateA, dateB ) {
						// ~~ faster than Math.floor
						return ~~( comparers.d( dateA, dateB ) / 7 );
						},

					m: function ( dateA, dateB ) {
						var month = _getMonth;
						return comparers.y( dateA, dateB  ) * 12 + month.call( dateB ) - month.call( dateA );
						},

					q: function ( dateA, dateB ) {
						// ~~ faster than Math.floor
						return ~~( comparers.m( dateA, dateB ) / 3 );
						},

					y: function ( dateA, dateB ) {
						var year = _getFullYear;
						return year.call( dateB ) - year.call( dateA );
						}

					},

				compare = dateTime.compare = function ( dateA, dateB, part ) {

					// new Date if not instance of Date
					dateA instanceof D || ( dateA = new D( dateA ) );

					// new Date if not instance of Date
					dateB instanceof D || ( dateB = new D( dateB ) );

					return comparers[ part ]( dateA, dateB );
					};

			return compare.apply( null, arguments );
			},


		/**
		 * Number of hours deviation from standard time. 0 if date is in standard time. A positive integer if in daylight savings time.
		 * @method hoursFromStandard
		 * @param {date} date Date object of string representing a date
		 * @return {integer} Hours from standard time
		 */

		hoursFromStandard: function ( date ) {

			var D = global.Date,
				DateProto = D.prototype,
				_date =  date instanceof D ? date : new D( date ),
				offset = DateProto.getTimezoneOffset,
				year = DateProto.getFullYear.call( date ),
				jan = new D( year, 0, 1 ),
				jul = new D( year, 6, 1 ),
				standard = global.Math.max( offset.call( jan ), offset.call( jul ) );

			return ( standard - offset.call( date ) ) / 60;
			},

		/**
		 *Returns true if year is leap year
		 * @method isLeapYear
		 * @param {integer} year
		 * @return {boolean} true if year is leap year
		 */

		isLeapYear: function ( year ) {
			return ( new global.Date( year, 1, 29 ) ).getDate() === 29;
			},


		/**
		 * Returns true if date is in daylight saving time.
		 * @method isDayLightSavings
		 * @param {date} date Date object of string representing a date
		 * @return {boolean} true if date is in daylight saving time.
		 */

		isDayLightSavings: function ( date ) {
			return !!dateTime.hoursFromStandard( date );
			}

		};

	/**
	 * Format a Date object or string representing a date with the use of a mask.
	 * @method format
	 * @param {Date} date Date to be used for generating the formated string return. Can be a
	 * string representing a date.
	 * @param {string} mask Mask of place-holder characters representing the desired date/time
	 * format. Characters can be escaped by surrounding them with single or double quotes.
	 * Valid characters include:
	 * dddd: Full weekday name,
	 * ddd: 3 character abbreviation of weekday name,
	 * dd: 2 digit padded day of the month,
	 * d: Day of the month,
	 * r: Suffix of day of the month (st, nd, rd, th),
	 * mmmm: Full month name,
	 * mmm: 3 character abbreviation of month name,
	 * mm: 2 digit padded month,
	 * m: monthd as digit,
	 * yyyy: 4 digit year,
	 * yy: 2 digit year,
	 * h: Hour (12 hour clock),
	 * hh: 2 digit padded hour (12 hour clock),
	 * H: Hour (24 hour clock),
	 * HH: 2 digit padded hour (24 hour clock),
	 * M: Minutes,
	 * MM: 2 digit padded minutes,
	 * s: Seconds,
	 * ss: 2 digit padded seconds,
	 * l: Milliseconds,
	 * L: 3 digit padded milliseconds,
	 * t: Lower case 'a' or 'p',
	 * tt: Lower case 'am' or 'pm',
	 * TT: Upper case 'AM' or 'PM',
	 * z: Title case short time zone name (ie.. 'Central' ),
	 * zz: Title case long time zone name (ie... 'Central Daylight Time' ),
	 * Z: Upper case time zone acronym (ie... 'CDT' )
	 * @param {boolean} UTC Flag for return date/time according to universal time.
	 * @return {string} A date/time string representing date in the format of the mask.
	 */

	( function ( global ) {

		var weekdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],

			months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],

			masks = {
				shortDate: 'm/d/yy',
				mediumDate: 'mmm d, yyyy',
				longDate: 'mmmm d, yyyy',
				fullDate: 'dddd, mmmm d, yyyy',
				shortTime: 'h:MMt',
				mediumTime: 'h:MM:ss TT',
				longTime: 'h:MM:ss TT Z',
				isoDate: 'yyyy-mm-dd',
				isoTime: 'HH:MM:ss',
				isoDateTime: 'yyyy-mm-dd"T"HH:MM:ss'
				},

			/**
			 * Define month names used by format method. Overriding the defaults. [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
			 * @method setFormatMonths
			 * @param {array} mo Array containing 12 month name strings
			 */

			setFormatMonths = function ( mo ) {
				months = mo;
				},


			/**
			 * Define weekday names used by format method. Overriding the defaults.  [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
			 * @method setFormatWeekdays
			 * @param {array} wkdays Array containing 7 weekday name strings
			 */

			setFormatWeekdays = function ( wkdays ) {
				weekdays = wkdays;
				},


			/**
			 * Define a predefined mask. Will override default of the same name.
			 * @method setFormatMask
			 * @param {string} key Short cut name for the mask
			 * @parma {string} mask String of valid mask characters to be passed to the format method in place
			 * of the key. See format method for valid characters and definitions
			 */

			setFormatMask = function ( key, mask ) {
				masks[ key ] = mask;
				},


			format = global.dateTime.format = function () {

				var suffixes = [ 'th', 'st', 'nd', 'rd' ],

					// regular expressions
					maskRegExp = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTtz])\1?|[LlrZ]|"([^"]*)"|'([^']*)'/g,
					zone = /[^(]+(?=\))/,
					acronym = /\b\w/g,

					/*
					 * Call all native Date, String, and Array methods
					 * from prototypes for performance.
					 * Lookup methods once here and store
					 * rather than looking up on every call.
					 * All calls are then for local variables.
					*/

					// Date ( time ) methods
					D = global.Date,
					DateProto = D.prototype,
					_toTimeString = DateProto.toTimeString,

					//setters
					_setDate = DateProto.setDate,
					_setMonth = DateProto.setMonth,
					_setFullYear = DateProto.setFullYear,

					_setMilliseconds = DateProto.setMilliseconds,
					_setSeconds = DateProto.setSeconds,
					_setMinutes = DateProto.setMinutes,
					_setHours = DateProto.setHours,

					// getters
					_getDate,
					_getDay,
					_getMonth,
					_getFullYear,

					_getMilliseconds,
					_getSeconds,
					_getMinutes,
					_getHours,

					getDate = _getDate = DateProto.getDate,
					getDay = _getDay =  DateProto.getDay,
					getMonth = _getMonth = DateProto.getMonth,
					getFullYear = _getFullYear = DateProto.getFullYear,

					getMilliseconds = _getMilliseconds = DateProto.getMilliseconds,
					getSeconds = _getSeconds = DateProto.getSeconds,
					getMinutes = _getMinutes = DateProto.getMinutes,
					getHours = _getHours = DateProto.getHours,

					getUTCDate = DateProto.getUTCDate,
					getUTCDay = DateProto.getUTCDay,
					getUTCMonth = DateProto.getUTCMonth,
					getUTCFullYear = DateProto.getUTCFullYear,

					getUTCMilliseconds = DateProto.getUTCMilliseconds,
					getUTCSeconds = DateProto.getUTCSeconds,
					getUTCMinutes = DateProto.getUTCMinutes,
					getUTCHours = DateProto.getUTCHours,

					// UTC _get methods flag
					UTC_getMethods = false,

					// reassign _get methods if out of sync with UTC flag
					sync_getMethods = function ( UTC ) {

						if ( UTC && !UTC_getMethods ) {
							_getDate = getUTCDate;
							_getDay = getUTCDay;
							_getMonth = getUTCMonth;
							_getFullYear = getUTCFullYear;
							_getMilliseconds = getUTCMilliseconds;
							_getSeconds = getUTCSeconds;
							_getMinutes = getUTCMinutes;
							_getHours = getUTCHours;

							UTC_getMethods = true;
							}

						else if ( !UTC && UTC_getMethods ) {
							_getDate = getDate;
							_getDay = getDay;
							_getMonth = getMonth;
							_getFullYear = getFullYear;
							_getMilliseconds = getMilliseconds;
							_getSeconds = getSeconds;
							_getMinutes = getMinutes;
							_getHours = getHours;

							UTC_getMethods = false;
							}

						},


					// String methods
					Str = global.String,
					StrProto = Str.prototype,
					slice = StrProto.slice,
					replace = StrProto.replace,
					split = StrProto.split,
					match = StrProto.match,


					// Array methods
					join = global.Array.prototype.join,


					/*
					 * helper functions
					 */

					// pad with zeroes if necessary
					pad = function ( value, length ) {
						value = Str( value );
						length !== undefined || ( length = 2 );
						while ( value.length < length ) value = '0' + value;
						return value;
						},

					// abbreviate string
					left = function ( value, length ) {
						return slice.call( Str( value ), 0, length );
						},

					// test for AM
					isAM = function ( date ) {
						return _getHours.call( date ) < 12;
						},

					// get full time zone string
					timeZone = function ( date ){
						return match.call( _toTimeString.call( date ), zone )[0];
						},

					replacers = {

						d: _getDate,

						dd: function () {
							return pad( _getDate.call( this ) );
							},

						ddd:  function () {
							return left( weekdays[ _getDay.call( this ) ], 3 );
							},

						dddd: function () {
							return weekdays[ _getDay.call( this ) ];
							},

						m: function () {
							return _getMonth.call( this ) + 1;
							},

						mm: function () {
							return pad( _getMonth.call( this ) + 1 );
							},

						mmm: function () {
							return left( months[ _getMonth.call( this ) ], 3 );
							},

						mmmm: function () {
							return months[ _getMonth.call( this ) ];
							},

						yy: function () {
							return slice.call( Str( _getFullYear.call( this ) ), 2 );
							},

						yyyy: _getFullYear,

						h: function () {
							return _getHours.call( this ) % 12 || 12;
							},

						hh: function () {
							return pad( _getHours.call( this ) % 12 || 12 );
							},

						H: _getHours,

						HH: function () {
							return pad( _getHours.call( this ) );
							},

						M: _getMinutes,

						MM: function () {
							return pad( _getMinutes.call( this ) );
							},

						s: _getSeconds,

						ss: function () {
							return pad( _getSeconds.call( this ) );
							},

						l: _getMilliseconds,

						L: function () {
							return pad( _getMilliseconds.call( this ), 3 );
							},

						t: function () {
							return isAM( this ) ? 'a' : 'p';
							},

						tt: function () {
							return isAM( this ) ? 'am' : 'pm';
							},

						T: function () {
							return isAM( this ) ? 'A' : 'P';
							},

						TT: function () {
							return isAM( this ) ? 'AM' : 'PM';
							},

						z: function () {
							return split.call( timeZone( this ), ' ' )[0];
							},

						zz: function () {
							return timeZone( this );
							},

						Z: function () {
							return join.call( match.call( timeZone( this ), acronym ), '' );
							},

						r: function () {
							var d = _getDate.call( this ),
								mod10 = d % 10;
							return suffixes[ mod10 > 3 ? 0 : ( d - mod10 !== 10 ) * mod10 ];
							}

						},

					format = dateTime.format = function ( date, mask, UTC ) {

						// new Date if not instance of Date
						date instanceof D || ( date = new D( date ) );

						// check for predefined mask
						mask = masks[ mask ] || mask;

						// make sure _get methods are appropriate
						sync_getMethods( UTC );

						// parse mask
						// replace placeholders with result of matching replacer function
						return replace.call( mask, maskRegExp, function ( $, _, dbl, sgl ) {
							return $ in replacers ? replacers[ $ ].call( date ) : dbl || sgl;
							});
						};

				format.setMonths = setFormatMonths;
				format.setWeekdays = setFormatWeekdays;
				format.setMask = setFormatMask;

				return format.apply( null, arguments );
				};

			format.setMonths = setFormatMonths;
			format.setWeekdays = setFormatWeekdays;
			format.setMask = setFormatMask;

	}( global ));
	
	// add format to Date prototype
	( function ( global ) {
		var proto = global.Date.prototype;
		if ( !proto.format ) {
			proto.format = function ( mask ) {
				return global.dateTime.format.call( null, this, mask );
				};
			}
	}( global ));

	// add move to Date prototype
	( function ( global ) {
		var proto = global.Date.prototype;
		if ( !proto.move ) {
			proto.move = function ( units, part ) {
				return global.dateTime.move.call( null, this, units, part );
				};
			}
	}( global ));

}( this ));