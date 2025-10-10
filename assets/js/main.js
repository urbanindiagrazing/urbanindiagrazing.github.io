(function ($) {

	var $window = $(window),
		$body = $('body');

	// Breakpoints.
	breakpoints({
		wide: ['1281px', '1680px'],
		normal: ['1001px', '1280px'],
		narrow: ['737px', '1000px'],
		mobile: [null, '736px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Scrolly.
	$('.scrolly').scrolly();

  // Sanitize phone number input as it is being entered
	$('#phone').on('input', function() {
		var sanitized = this.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

		// remove leading +1 if present
		if (sanitized.startsWith('1')) {
			sanitized = sanitized.slice(1);
		}
		if (sanitized.length > 10) {
			sanitized = sanitized.slice(0, 10); // Limit to 10 digits
		}

		// Rewrite it as formatted value
		this.value = sanitized;
	});

	// Update the _subject field based on form inputs
	function updateSubject() {
		const eventType = $('#eventType').val().trim();
		const eventDate = $('#eventDate').val();
		const guests = $('#guests').val();

		// Build the subject line
		let subject = "UIG";
		if (eventType || eventDate || guests) subject += " |";

		if (eventType) subject += " " + eventType;
		if (eventDate) subject += " on " + eventDate;
		if (guests) subject += " for " + guests + " guests";

		// Update the hidden _subject field
		$('#_subject').val(subject);
	}

	// Trigger update when any of these fields change
	$('#eventType, #eventDate, #guests').on('input change', updateSubject);

})(jQuery);