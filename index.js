const seatGeekApiKey = 'MTY3NTIzOTB8MTU1ODY0MzMzOS41Mw'
let seatGeekURLGeoLocation = `https://api.seatgeek.com/2/events?client_id=${seatGeekApiKey}&geoip=true`

const googleGeoCodeApiKey = 'AIzaSyDOvfuKaaRuYocVQWNl9ICi3wadIephDyc'

const openWeatherApiKey = '3df5e3cb936985be70ed3a06b4df61b9'

let yelpLat
let yelpLong 
let yelpRadius
let yelpLocation

let selectedEventObj = {}
let dateCostArr = []
let eventPrice


// FIND GEOLOCATION OF USER AND SET AS DEFAULT VALUE OF LOCATION SEARCH-INPUT 
function geoLocate(){
		fetch(seatGeekURLGeoLocation).then(response => {
			if (response.status === 200){
				return response.json()	
			} else {
				throw new Error(response.statusText)
			}
		}).then(responseJson =>{
			
			let currentLocation = responseJson.meta.geolocation.display_name
			
			// STORE CURRENT LOCATION IN SELECTEDEVENTOBJECT
			selectedEventObj.currentLocation = {
				cityAndState: currentLocation,
				lat: responseJson.meta.geolocation.lat,
				long: responseJson.meta.geolocation.lon
			}
			
			// SET LOCATION INPUT TO CURRENTLOCATION
			$('#location').val(currentLocation)
		})
	
}


// EVENT SEARCH-FORM SUBMIT HANDLER 
$('main').on('submit', '.event-search-form', (e)=>{
	e.preventDefault();
	
	$('.results').empty();

	let searchQuery = $('.event').val()
	let city = $('.location').val().split(',')[0].trim()
	let state = $('.location').val().split(',')[1].trim()
		
	let seatGeekURLcityState = `https://api.seatgeek.com/2/events?client_id=${seatGeekApiKey}&venue.city=${city}&venue.state=${state}`
	
	fetch(seatGeekURLcityState).then(response=>{
		if (response.status === 200){
				return response.json()	
			} else {
				throw new Error(response.statusText)
			}
		}).then(responseJson =>{
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
				let eventAddress = `${eventsArr[i].venue.address} ${eventsArr[i].venue.extended_address}`
				let eventID = eventsArr[i].id
				
				eventPrice = `~$${eventsArr[i].stats.average_price*2}`
				
				if (eventPrice === '~$0'){
					eventPrice = 'N/A'
				}
				
				resultDiv = `
					<div class="eventResults" id=${eventID}>
						<header>${eventTitle}</header>
						<span class="eventDateTime">${eventDateTime}</span>
						<div class="event-venue-address">
							<span class="eventVenue">${eventVenue}</span>
							<span class="eventAddress">${eventAddress}</span>
						</div>
						<span class="event-price">Tickets For Two: ${eventPrice}</span>
						<a href="${eventURL}" target="_blank"><button class="eventURL">DETAILS</button></a>
					</div>`
				
				$('.results').append(resultDiv)

			}
		})
})
	
function entertainmentPageGenerator(){
	return `	
		<form action="" class="event-search-form">
			<legend><h2>Search and Select Event</h2></legend>
				<input type="text" class="search-input location" placeholder="Location" id="location">
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

function finalPageGenerator(){
	return `
	<header class="itin-msg">
			<h2>May 5th 2019</h2>
		</header>
		
		<div class="date-details">
			<div class="weather-cost-wrapper">
				<div class="weather">
					<header>Local Weather</header>
					<div class="tempAndDesc">
						<span class="temp">79°F</span>
						<span class="desc"><i>Warm/Cloudy</i></span>
					</div>
					<span class="precip">Precipitation: 23%</span>
					<span class="humidity">Humidity: 53%</span>
				</div>

				<div class="cost">
					<header>Estimated Total Cost</header>

					<span class="event-tickets">2 Tickets to Event: $86</span>
					<span class="dinner-price">Dinner for 2: $90</span>
					<span class="total-cost">Total Est. Cost: $176</span>
				</div>
			</div>
			
			<div class="event-restaurant-details-wrapper">
				<div class="event-details">
					<header>Event Details</header>
					<span class="event-name">Youssou N'Dour</span>
					<span class="event-address">5301 Tuckerman Ln. North Bethesda, MD 20852</span>
					<span class="event-time">Doors: 730PM</span>
					<a href="#"><button class="event-link">Details</button></a>

				</div>

				<div class="restaurant-details">
					<header>Restaurant Details</header>
					<span class="restaurant-name">Mi Rancho</span>
					<span class="restaurant-address">8701 Ramsey Ave, Silver Spring 20910</span>
					<span class="restaurant-hours">Hours: 11AM-730PM</span>
						<div class="restaurant-btns-wrapper">
							<a href="#"><button class="restaurant-menu">Menu</button></a>
							<a href="#"><button class="restaurant-link">Details</button></a>
						</div>
				</div>
				
			</div>	
			
			</div>
		
				<div class="date-details-btn-wrapper">
					<button class="save-date-btn">Save</button>
					<button class="share-date-btn">Share</button>
				</div>`
}

function appendPage(page){
	$('main').empty()
	$('main').append(page)
}


$('.start-btn').on('click', (e)=>{
	appendPage(entertainmentPageGenerator())
	geoLocate()

})

$('main').on('click', '.eventResults', (e)=>{
	
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
		if (response.status === 200){
				return response.json()	
			} else {
				throw new Error(response.statusText)
			}
		}).then(event =>{	
			console.log(event)
			selectedEventObj = {
				eventName: event.title,
				eventTime: event.datetime_local,
				eventAddress: `${event.venue.address} ${event.venue.extended_address}`,
				eventID: selectedEventID,
				eventDetailsLink: event.url,
				eventCoors: {
					lat: event.venue.location.lat,
					long: event.venue.location.lon
				},
				eventVenue: event.venue.name,
				eventType: event.type,
				eventLocation: event.venue.display_location,
				dateCostArr: [Number(eventPrice.substring(2))]
			}
		
		console.log(selectedEventObj)
		
		// STORE EVENTOBJ IN FIREBASE
		
		axios.post('https://perfect-date-app.firebaseio.com/event.json', selectedEventObj)
			
	
		// MOVE USER TO NEXT-PAGE
		appendPage(foodAndDrinksPageGenerator())
		
		 yelpLat = selectedEventObj.eventCoors.lat
		 yelpLong = selectedEventObj.eventCoors.long
		 yelpRadius = 8046.72
		 yelpLocation = selectedEventObj.eventLocation
		
		
			$('.yelp-locations').val(yelpLocation)

	})
})

$('main').on('submit', '.yelp-search-form', (e)=>{
	e.preventDefault();
	
	let zomatoSearchQuery = $('.yelp-queryString').val()
			
	const zomatoApiKey = '9fc6bb49836d20f169da8151581bde82'
	
	let zomatoApiURL = `https://developers.zomato.com/api/v2.1/search?q=${zomatoSearchQuery}&lat=${yelpLat}&lon=${yelpLong}&radius=${yelpRadius}`
	
	const headers = {
		"headers": {
		"user-key": "9fc6bb49836d20f169da8151581bde82"
	  }
	}
	
	
	fetch(zomatoApiURL, headers).then(response=>{
		if (response.status === 200){
				return response.json()	
			} else {
				throw new Error(response.statusText)
			}
		}).then(foodanddrink =>{
			console.log(foodanddrink)
		
			let foodAndDrinkArr = foodanddrink.restaurants
			
			console.log(foodAndDrinkArr)
		
	
		
			for (let i = 0 ; i < foodAndDrinkArr.length; i++){
				let zomatoName = foodAndDrinkArr[i].restaurant.name
				let zomatoCuisines = foodAndDrinkArr[i].restaurant.cuisines
				let zomatoAddress = foodAndDrinkArr[i].restaurant.location.address
				let zomatoMenuURL = foodAndDrinkArr[i].restaurant.menu_url
				let zomatoDetailsURL = foodAndDrinkArr[i].restaurant.url
				let zomatoPrice = foodAndDrinkArr[i].restaurant.average_cost_for_two
				let zomatoRatings = foodAndDrinkArr[i].restaurant.user_rating.aggregate_rating
				let zomatoRatingsText = foodAndDrinkArr[i].restaurant.user_rating.rating_text
				let zomatoID = foodAndDrinkArr[i].restaurant.R.res_id
				

				let resultDiv = `
					<div class="zomatoResults" id=${zomatoID}>
						<header>${zomatoName}</header>
						<span class="zomato-ratings">Ratings: <strong>${zomatoRatings}/5</strong></span>

						<span class="eventDateTime"><i>${zomatoCuisines}</i></span>
						
						<div class="event-venue-address">
							<span class="eventAddress">${zomatoAddress}</span>
						</div>
						<span class="zomato-price">Cost For Two: <strong>$${zomatoPrice}</strong></span>
						
						<div class="result-btns-wrapper">
							<a href="${zomatoMenuURL}" target="_blank"><button class="eventURL">MENU</button></a>
							<a href="${zomatoDetailsURL}" target="_blank"><button class="eventURL">DETAILS</button></a>
						</div>
					</div>`

				$('.results').append(resultDiv)
			}
		
		
	})

	
})

$('main').on('click', '.zomatoResults', (e)=>{
	
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
			if (response.status === 200){
					return response.json()	
				} else {
					throw new Error(response.statusText)
				}
			}).then(resDetails =>{
				console.log(resDetails)
			
				selectedEventObj.restaurantName = resDetails.name
				selectedEventObj.restaurantAddress = resDetails.location.address
				selectedEventObj.dateCostArr.push(resDetails.average_cost_for_two)
				selectedEventObj.restaurantCoors = {
						lat: Number(resDetails.location.latitude),
						long: Number(resDetails.location.longitude)
				}
				
				selectedEventObj.restaurantMenu = resDetails.menu_url
				selectedEventObj.restaurantDetails = resDetails.url
				selectedEventObj.restaurantFoodType = resDetails.cuisines
				
				
						
							let finalPageHTML = `
						
								<header class="itin-msg">
									<h2>${selectedEventObj.eventTime}</h2>
								</header>

								<div class="date-details">

									<div class="cost">
										<header><h1>Estimated Total Cost</h1></header>

										<span class="event-tickets"><span class="names">${selectedEventObj.eventName}</span>: <span class="costVal">$${selectedEventObj.dateCostArr[0]}</span></span>
										<span class="dinner-price"><span class="names">${selectedEventObj.restaurantName}</span>: <span class="costVal">$${selectedEventObj.dateCostArr[1]}</span></span>
										<span class="total-cost">Total: <span class="costVal">$${selectedEventObj.dateCostArr[0] + selectedEventObj.dateCostArr[1]}</span></span>
									</div>

									<div class="event-restaurant-details-wrapper">
										<div class="event-details">
											<header><h1><span class="event-name">${selectedEventObj.eventName}</span></h1></header>
											
											<span class="event-venue">${selectedEventObj.eventVenue}</span>
											<span class="event-address">${selectedEventObj.eventAddress}</span>
											<span class="event-time">${selectedEventObj.eventTime}</span>
											<a href="${selectedEventObj.eventDetailsLink}"><button class="event-link">Details</button></a>
										</div>

										<div class="restaurant-details">
											<header><h1><span class="restaurant-name">${selectedEventObj.restaurantName}</span></h1></header>
											<span class="restaurant-foodType">${selectedEventObj.restaurantFoodType}</span>
											<span class="restaurant-address">${selectedEventObj.restaurantAddress}</span>

										<div class="restaurant-btns-wrapper">
													<a href="${selectedEventObj.restaurantMenu}"><button class="restaurant-menu">Menu</button></a>
													<a href="${selectedEventObj.restaurantDetails}"><button class="restaurant-link">Details</button></a>
												</div>
										</div>

									</div>	

									</div>

										<div class="date-details-btn-wrapper">
											<button class="save-date-btn">Save</button>
											<button class="share-date-btn">Share</button>
										</div>`
							
							appendPage(finalPageHTML)
						})
					})