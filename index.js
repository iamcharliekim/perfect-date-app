const seatGeekApiKey = 'MTY3NTIzOTB8MTU1ODY0MzMzOS41Mw'
let seatGeekURLGeoLocation = `https://api.seatgeek.com/2/events?client_id=${seatGeekApiKey}&geoip=true`

const googleGeoCodeApiKey = 'AIzaSyDOvfuKaaRuYocVQWNl9ICi3wadIephDyc'
const googleApiKey = `AIzaSyDOvfuKaaRuYocVQWNl9ICi3wadIephDyc`
				
let yelpLat
let yelpLong 
let yelpRadius
let yelpLocation

let selectedEventObj = {
				origLocation: '',
				eventSelected: false,
				eventName: '',
				eventTime: '',
				eventAddress: '',
				eventID: '',
				eventDetailsLink: '',
				eventCoors: {
					lat: '',
					long: ''
				},
				eventVenue: '',
				eventType: '',
				eventLocation: '', 
				eventCost: '',
				restaurantSelected: false,
				restaurantName: '',
				restaurantAddress: '',
				restaurantCost: '',
				restaurantCoors: {
					lat: '',
					long: ''
				},
				restaurantMenu: '',
				restaurantDetails: '',
				restaurantFoodType: ''
}




let currentLocation

let eventPrice

let showMenu = false
let historyCounter = 0

let history = [mainPageGenerator(), entertainmentPageGenerator(), foodAndDrinksPageGenerator()]

function backBtnDisabler(){
	if (historyCounter < 1){
		$('.back').hide()
	} else {
		$('.back').show()
	}
}

function forwardBtnDisable(){
	if (historyCounter >= 2 || historyCounter === 0){
		$('.forward').hide()
	} else {
		$('.forward').show()
	}
}


let finalPageHTML


// FIND GEOLOCATION OF USER AND SET AS DEFAULT VALUE OF LOCATION SEARCH-INPUT 
function geoLocate(){
		fetch(seatGeekURLGeoLocation).then(response => {
			if (response.status === 200){
				return response.json()	
			} else {
				throw new Error(response.statusText)
			}
		}).then(responseJson =>{
			
			currentLocation = responseJson.meta.geolocation.display_name
			
			// SET LOCATION INPUT TO CURRENTLOCATION
			$('.e-search').val(currentLocation)
					$('.event-search-form').submit()

		})
		
}


function displayLoader(){
	$('.spinner-bg').css('display', 'flex')
}

function hideLoader(){
	$('.spinner-bg').css('display', 'none')
}

// EVENT SEARCH-FORM SUBMIT HANDLER 
$('main').on('submit', '.event-search-form', (e)=>{
	e.preventDefault();
	
	$('.results').empty();

	let city = $('.e-search').val().split(',')[0].trim()
	
	let state = $('.e-search').val().split(',')[1].trim()
	
	let origLocation = `${city},+${state}`
	
	selectedEventObj.origLocation = origLocation;
	
	let seatGeekURLcityState = `https://api.seatgeek.com/2/events?client_id=${seatGeekApiKey}&venue.city=${city}&venue.state=${state}&range=5mi`
	
	fetch(seatGeekURLcityState).then(response=>{
		displayLoader();
		if (response.status === 200){
				return response.json()	
			} else {
				throw new Error(response.statusText)
				hideLoader()
			}
		}).then(responseJson =>{
			console.log(responseJson)
			hideLoader();
			let eventsArr = responseJson.events
			let resultDiv

			if (eventsArr.length === 0){
				
				 resultDiv = `
						<div class="eventResults noResults">
							<header>No listed events in <span class="noResultsLocation">${city}, ${state}</span></header>
						</div>`
				 $('.results').append(resultDiv)
			} 
		
			for (let i = 0; i < eventsArr.length; i++){
				let eventTitle = eventsArr[i].title 
				let eventDateTime = eventsArr[i].datetime_local
				let eventURL = eventsArr[i].url
				let eventVenue = eventsArr[i].venue.name
				let eventID = eventsArr[i].id
				
				
				eventPrice = `~$${eventsArr[i].stats.average_price*2}`
				
				if (eventPrice === '~$0'){
					eventPrice = 'N/A'
				}
				
				let eventLong = eventsArr[i].venue.location.lon
				let eventLat = eventsArr[i].venue.location.lat
				
				const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${eventLat},${eventLong}&key=${googleGeoCodeApiKey}`
				console.log(googleApiURL)
				
				fetch(googleApiURL).then(response => {
					if (response.status === 200){
						return response.json()	
					} else {
						throw new Error(response.statusText)
					}

				}).then(responseJson =>{
					
				let eventAddress = responseJson.results[0].formatted_address

				let addressArr = eventAddress.split(' ')
				let eventAddressURI = addressArr.join('+')
				let googleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${origLocation}&destination=${eventAddressURI}`
					
					resultDiv = `
					<div class="eventResults" id=${eventID}>
						<header>${eventTitle}</header>
						<input type="checkbox" class="event-select">
						<span class="eventDateTime">${timeParser(eventDateTime)[0]} @ ${timeParser(eventDateTime)[1]}</span>
						<div class="event-venue-address">
							<span class="eventVenue">${eventVenue}</span>
							<span class="eventAddress"><a href="${googleMapsLinkURL}" target="_blank" class="google-address">${eventAddress}</a></span>
						</div>
						<span class="event-price">Tickets (2): <span class="eventCostVal">${eventPrice}</span></span>
						<a href="${eventURL}" target="_blank"><button class="eventURL">DETAILS</button></a>
					</div>`
				
				$('.results').append(resultDiv)
				})


			}
		})
})


	
function entertainmentPageGenerator(){
	return `	
		<form action="" class="event-search-form">
			<legend><h2>Search and Select Event</h2></legend>
				<input type="text" class="search-input e-search location" placeholder="Location" id="location">
				<button type="submit" class="submit-btn">Search</button>
		</form>

		<div class="results"></div>`
}

function foodAndDrinksPageGenerator(){
	return `
		<form action="" class="yelp-search-form">
			<legend><h2>Let's Find a Spot Nearby For Food and Drinks!</h2></legend>
				
				<input type="text" class="search-input yelp-queryString" placeholder="Keywords..." id="location">		
			
				

				<input type="text" class="search-input location yelp-locations" placeholder="Location" id="location">


				<button type="submit" class="submit-btn">Search</button>
			
		</form>
	
		
		<div class="results">
			
		</div>`
}


function mainPageGenerator(){
	return `<div class="hero">
			<div class="hero-msg">
				<h2>Plan Your Perfect Date Today!</h2>
			</div>
		</div>

		<div class="cta">
			<button class="start-btn">START PLANNING</button>
		</div>
	`
}

function appendPage(page){
		console.log(historyCounter)
	backBtnDisabler()
	forwardBtnDisable()
	
		historyCounter++;	

	
	$('main').empty()
	$('main').append(page)
	console.log(historyCounter)
	
	if (historyCounter === 2 && selectedEventObj.eventSelected){
		$('.e-search').val(selectedEventObj.eventLocation)
		$('.event-search-form').submit();
	}
	
	if (historyCounter === 3 && selectedEventObj.restaurantSelected){
		$('.yelp-locations').val(selectedEventObj.eventLocation)
		$('.yelp-search-form').submit()
	}
}

$('main').on('click', '.start-btn', (e)=>{
	appendPage(history[historyCounter])
	geoLocate()
	
	
})


$('main').on('submit', '.yelp-search-form', (e)=>{
	e.preventDefault();
	
	let zomatoSearchQuery = $('.yelp-queryString').val()
			
	const zomatoApiKey = '9fc6bb49836d20f169da8151581bde82'
	
	let zomatoApiURL = `https://developers.zomato.com/api/v2.1/search?q=${zomatoSearchQuery}&lat=${yelpLat}&lon=${yelpLong}&radius=1000`
	
	const headers = {
		"headers": {
		"user-key": "9fc6bb49836d20f169da8151581bde82"
	  }
	}
	
	
	fetch(zomatoApiURL, headers).then(response=>{
		displayLoader()
		if (response.status === 200){
				return response.json()	
			} else {
				throw new Error(response.statusText)
				hideLoader()
			}
		}).then(foodanddrink =>{
			console.log(foodanddrink)
		
			hideLoader();
		
			let foodAndDrinkArr = foodanddrink.restaurants
			
			console.log(foodAndDrinkArr)
		
	
		
			for (let i = 0 ; i < foodAndDrinkArr.length; i++){
				let zomatoName = foodAndDrinkArr[i].restaurant.name
				let zomatoCuisines = foodAndDrinkArr[i].restaurant.cuisines
							
				
				let zomatoMenuURL = foodAndDrinkArr[i].restaurant.menu_url
				let zomatoDetailsURL = foodAndDrinkArr[i].restaurant.url
				let zomatoPrice = foodAndDrinkArr[i].restaurant.average_cost_for_two
				let zomatoRatings = foodAndDrinkArr[i].restaurant.user_rating.aggregate_rating
				let zomatoRatingsText = foodAndDrinkArr[i].restaurant.user_rating.rating_text
				let zomatoID = foodAndDrinkArr[i].restaurant.R.res_id
				
				let zomatoLat = foodAndDrinkArr[i].restaurant.location.latitude
				let zomatoLong = foodAndDrinkArr[i].restaurant.location.longitude
				
				console.log(zomatoLong, zomatoLat)
				
				const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${zomatoLat},${zomatoLong}&key=${googleGeoCodeApiKey}`
				
				console.log(googleApiURL)
				
				fetch(googleApiURL).then(response => {
					if (response.status === 200){
						return response.json()	
					} else {
						throw new Error(response.statusText)
					}

				}).then(responseJson =>{
					console.log(responseJson)
				let zomatoAddress = responseJson.results[0].formatted_address
				let addressArr = zomatoAddress.split(' ')
				let zomatoAddressURI = addressArr.join('+')
				let eventAddressURI = selectedEventObj.eventAddress.split(' ').join('+')
				let googleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${eventAddressURI}&destination=${zomatoAddressURI}`	
					
				

				let resultDiv = `
					<div class="zomatoResults" id=${zomatoID}>
						<header>${zomatoName}</header>
						<input type="checkbox" class="event-select">

						<span class="eventDateTime"><i>${zomatoCuisines}</i></span>

						<span class="zomato-ratings">Ratings: <strong>${zomatoRatings}/5</strong></span>
						
						<div class="event-venue-address">
							<span class="eventAddress"><a href="${googleMapsLinkURL}" target="_blank" class="google-address">${zomatoAddress}</a></span>
						</div>
						<span class="zomato-price">Cost For Two: <strong>~$${zomatoPrice}</strong></span>
						
						<div class="result-btns-wrapper">
							<a href="${zomatoMenuURL}" target="_blank"><button class="eventURL">MENU</button></a>
							<a href="${zomatoDetailsURL}" target="_blank"><button class="eventURL">DETAILS</button></a>
						</div>
					</div>`

				$('.results').append(resultDiv)
			})
		
		
	}
})
})


$('main').on('click', '.eventResults > .event-select', (e)=>{
	console.log(e.target)
	console.log(eventPrice)
	let selectedEventID;
	
	if (e.target.id){
		selectedEventID = e.target.id
	} else {
		selectedEventID = $(e.target).parents('.eventResults')[0].id	
	}
	
	if (e.target.className !== 'eventURL'){
		$(`#${selectedEventID}`).addClass('selected-event')
	}
	
	
	let seatGeekURLbyID = `https://api.seatgeek.com/2/events/${selectedEventID}?client_id=${seatGeekApiKey}`
	
	fetch(seatGeekURLbyID).then(response=>{
		displayLoader();
		
		if (response.status === 200){
				return response.json()	
			} else {
				throw new Error(response.statusText)
				hideLoader();
			}
		}).then(event =>{	
			
			hideLoader();
			console.log(event)
			
			let eventLat = event.venue.location.lat
			let eventLong = event.venue.location.lon
			
			const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${eventLat},${eventLong}&key=${googleGeoCodeApiKey}`
				
				console.log(googleApiURL)
				
				fetch(googleApiURL).then(response => {
					if (response.status === 200){
						return response.json()	
					} else {
						throw new Error(response.statusText)
					}

				}).then(responseJson =>{
					console.log(responseJson)
		
			selectedEventObj = {
				eventSelected: true,
				eventName: event.title,
				eventTime: event.datetime_local,
				eventAddress: responseJson.results[0].formatted_address,
				eventID: selectedEventID,
				eventDetailsLink: event.url,
				eventCoors: {
					lat: event.venue.location.lat,
					long: event.venue.location.lon
				},
				eventVenue: event.venue.name,
				eventType: event.type,
				eventLocation: event.venue.display_location,
				eventCost: event.stats.average_price * 2
			}
		
		console.log(selectedEventObj)
		
		// STORE EVENTOBJ IN FIREBASE
		
		axios.post('https://perfect-date-app.firebaseio.com/event.json', selectedEventObj)
			
	
		// MOVE USER TO NEXT-PAGE
		appendPage(foodAndDrinksPageGenerator());
		console.log('FoodAndDrinksPage loaded')
		
		 yelpLat = selectedEventObj.eventCoors.lat
		 yelpLong = selectedEventObj.eventCoors.long
		 yelpRadius = 1609.34
		 yelpLocation = selectedEventObj.eventLocation
		
		
		$('.yelp-locations').val(yelpLocation)
		$('.yelp-search-form').submit()

	})
})
})


$('main').on('click', '.zomatoResults > .event-select', (e)=>{
	
	let selectedEventID;
	
	if (e.target.id){
		selectedEventID = e.target.id
	} else {
		selectedEventID = $(e.target).parents('.zomatoResults')[0].id	
	}
	
	
	if (e.target.className !== 'zomatoResults'){
		$(`#${selectedEventID}`).addClass('selected-event')
	}
	
	
	// MAKE A GET-REQUEST FOR RESTAURANT DETAILS BASED ON ID AND STORE DETAILS INTO SELECTEDEVENTSOBJ
		const zomatoApiKey = '9fc6bb49836d20f169da8151581bde82'

		const headers = {
			"headers": {
				"user-key": "9fc6bb49836d20f169da8151581bde82"
			}
		}
		
		let zomatoApiURLByID = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${selectedEventID}`

	
		fetch(zomatoApiURLByID, headers).then(response=>{
			displayLoader();
			if (response.status === 200){
					return response.json()	
				} else {
					throw new Error(response.statusText)
					hideLoader()
				}
			}).then(resDetails =>{
				
				hideLoader();
			
				console.log(resDetails)
			
				let zomatoLong = resDetails.location.longitude
				let zomatoLat = resDetails.location.latitude
				
				console.log(zomatoLong, zomatoLat)
				
				const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${zomatoLat},${zomatoLong}&key=${googleGeoCodeApiKey}`
				
				console.log(googleApiURL)
				
				fetch(googleApiURL).then(response => {
					if (response.status === 200){
						return response.json()	
					} else {
						throw new Error(response.statusText)
					}

				}).then(responseJson =>{
					console.log(responseJson)
					let zomatoAddress = responseJson.results[0].formatted_address

					let restaurantAddressURI = zomatoAddress.split(' ').join('+')
					let eventAddressURI = selectedEventObj.eventAddress.split(' ').join('+')
					let restaurantGoogleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${eventAddressURI}&destination=${restaurantAddressURI}`
					
					let eventGoogleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${selectedEventObj.origLocation}&destination=${eventAddressURI}`	


					selectedEventObj.restaurantName = resDetails.name
					selectedEventObj.restaurantAddress = zomatoAddress
					selectedEventObj.restaurantCost = Number(resDetails.average_cost_for_two)
					selectedEventObj.restaurantCoors = {
							lat: Number(resDetails.location.latitude),
							long: Number(resDetails.location.longitude)
					}
				
					selectedEventObj.restaurantMenu = resDetails.menu_url
					selectedEventObj.restaurantDetails = resDetails.url
					selectedEventObj.restaurantFoodType = resDetails.cuisines
					selectedEventObj.restaurantSelected = true
						
							 finalPageHTML = `
						
								<header class="itin-msg">
									<h2>Date Summary</h2>
								</header>

								<div class="date-details">

									<div class="cost">
										<header><h1>Estimated Total Cost</h1></header>

										<span class="event-tickets"><span class="names">${selectedEventObj.eventName}</span>: <span class="costVal">$${selectedEventObj.eventCost}</span></span>
										<span class="dinner-price"><span class="names">${selectedEventObj.restaurantName}</span>: <span class="costVal">$${selectedEventObj.restaurantCost}</span></span>
										<span class="total-cost">Total: <span class="costVal">$${Number(selectedEventObj.eventCost + selectedEventObj.restaurantCost)}</span></span>
									</div>



									<div class="event-restaurant-details-wrapper">
										<div class="event-details">
											<header>
												<h1>
													<span class="event-name">${selectedEventObj.eventName}</span>
												</h1>
											</header>

										<div class="event-venue-address">
											<span class="eventVenue">${selectedEventObj.eventVenue}</span>
										<span class="eventAddress"><a href="${eventGoogleMapsLinkURL}" target="_blank" class="google-address">
											${selectedEventObj.eventAddress}</a></span>
										</div>
										
											<span class="event-time">${timeParser(selectedEventObj.eventTime)[0]} @ ${timeParser(selectedEventObj.eventTime)[1]}</span>
											<a href="${selectedEventObj.eventDetailsLink}"><button class="event-link">Details</button></a>
										</div>

										<div class="restaurant-details">
											<header><h1><span class="restaurant-name">${selectedEventObj.restaurantName}</span></h1></header>
											<span class="restaurant-foodType"><i>${selectedEventObj.restaurantFoodType}</i></span>
										<span class="restaurant-address">
											<a href="${restaurantGoogleMapsLinkURL}" target="_blank" class="google-address">${selectedEventObj.restaurantAddress}</a></span>
										

										<div class="restaurant-btns-wrapper">
													<a href="${selectedEventObj.restaurantMenu}"><button class="restaurant-menu">Menu</button></a>
													<a href="${selectedEventObj.restaurantDetails}"><button class="restaurant-link">Details</button></a>
												</div>
										</div>

									</div>	

									</div>

										`
							
							appendPage(finalPageHTML)
							console.log(selectedEventObj)
						})
					})
})



$('.hamburger').on('click', (e)=>{
	showMenu = !showMenu

	if (showMenu){
		$('main').hide();
		$('.menu').show()
	} else {
		$('main').show();
		$('.menu').hide()
	}
	
})

$('.menu .home').on('click', (e)=>{
	historyCounter = 0;
	appendPage(mainPageGenerator())
	$('.menu').hide()
	$('main').show()
	
})

$('.home-logo').on('click', (e)=>{
	historyCounter = 0;
	appendPage(mainPageGenerator())
	$('.menu').hide()
	$('main').show()
	
})

$('.back').on('click', (e)=>{

	
	$('.menu').hide()
	historyCounter = historyCounter - 2
	console.log(historyCounter)


	
	appendPage(history[historyCounter])
	$('main').show()
	
	
	


})

$('.forward').on('click', (e)=>{
	console.log(historyCounter)
	
	$('.menu').hide()
	$('main').show()
	
	
	appendPage(history[historyCounter]) 
	
	
	console.log(historyCounter)

})

$('.contact').on('click', (e)=>{
		console.log('test')
})


function timeParser(dateObj){
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	
	let date = dateObj.split('T')[0]
	let time = dateObj.split('T')[1]
	
	let year = date.substring(0,4)
	let month = months[Number(date.substring(5).substring(0,2))-1]
	let day = date.substring(5).substring(3)
	
	let dateString = `${month} ${day} ${year}`
	
	let hours = time.substring(0,2)
	console.log('hours:', hours)
	
	let dayOrNight;
	
	hours < 12 ? dayOrNight = 'AM' : dayOrNight = 'PM'
	hours > 12 ? hours = hours - 12 : hours = hours
	
	let minutes = time.substring(2).substring(1,3)
	
	let timestring = `${hours}:${minutes}${dayOrNight}`
	console.log(timestring)
	
	return [dateString, timestring]
}

function start(){
	appendPage(history[historyCounter])
}

start()