let selectedEventObj

const selectedEventObjReset = {
                seatGeekApiKey: 'MTY3NTIzOTB8MTU1ODY0MzMzOS41Mw',
                googleApiKey: 'AIzaSyDOvfuKaaRuYocVQWNl9ICi3wadIephDyc',
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
                restaurantLocation: '',
				restaurantCost: '',
				restaurantCoors: {
					lat: '',
					long: ''
				},
				restaurantMenu: '',
				restaurantDetails: '',
				restaurantFoodType: '',
                showMenu: false,
                historyCounter: 0,
                history: [mainPageGenerator(), entertainmentPageGenerator(), foodAndDrinksPageGenerator()],
                zomatoSearchQuery: ''
}

// FUNCTIONS: START
function start(){
    selectedEventObj = selectedEventObjReset
	appendPage(selectedEventObj.history[selectedEventObj.historyCounter])
}

// FUNCTIONS: BACK-BTN-DISABLER
function backBtnDisabler(){
	if (selectedEventObj.historyCounter< 2){
		$('.back').hide()
	} else {
		$('.back').show()
	}
}

// FUNCTIONS: FORWARD-BTN-DISABLER
function forwardBtnDisable(){
	if (selectedEventObj.historyCounter>= 1 || selectedEventObj.historyCounter=== 0){
		$('.forward').hide()
	} else {
		$('.forward').show()
	}
}

// FUNCTION: GEOLOCATE USER'S COORDINATES AND AUTOMATICALLY SUBMIT EVENT-SEARCH
function geoLocate(){
        
    let seatGeekURLGeoLocation = `https://api.seatgeek.com/2/events?client_id=${selectedEventObj.seatGeekApiKey}&geoip=true`

		fetch(seatGeekURLGeoLocation).then(response => {
			if (response.status === 200){
				return response.json()	
			} else {
				throw new Error(response.statusText)
			}
		}).then(responseJson =>{
			
			let currentLocation = responseJson.meta.geolocation.display_name
			
			// SET LOCATION INPUT TO CURRENTLOCATION
			$('.e-search').val(currentLocation)
					$('.event-search-form').submit()

		})
		
}

// FUNCTIONS: DISPLAY LOADER
function displayLoader(){
	$('.spinner-bg').css('display', 'flex')
}

// FUNCTIONS: HIDE LOADER
function hideLoader(){
	$('.spinner-bg').css('display', 'none')
}

// FUNCTIONS: TIME-PARSER
function timeParser(dateObj){
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	
	let date = dateObj.split('T')[0]
	let time = dateObj.split('T')[1]
	
	let year = date.substring(0,4)
	let month = months[Number(date.substring(5).substring(0,2))-1]
	let day = date.substring(5).substring(3)
	
	let dateString = `${month} ${day} ${year}`
	
	let hours = time.substring(0,2)
	
	let dayOrNight;
	
	hours < 12 ? dayOrNight = 'AM' : dayOrNight = 'PM'
	hours > 12 ? hours = hours - 12 : hours = hours
	
	let minutes = time.substring(2).substring(1,3)
	
	let timestring = `${hours}:${minutes}${dayOrNight}`
	
	return [dateString, timestring]
}

// PAGE-GENERATOR: HOME
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

// PAGE-GENERATOR: EVENTS
function entertainmentPageGenerator(){
	return `	
		<form action="" class="event-search-form">
			<legend><h2>Search and Select Event</h2></legend>
				<input type="text" class="search-input e-search location" placeholder="Location" id="location">
				<button type="submit" class="submit-btn">Search</button>
		</form>

		<div class="results"></div>

	    <div class="no-results"></div>
`
}

// PAGE-GENERATOR: RESTAURANTS
function foodAndDrinksPageGenerator(){
	return `
		<form action="" class="yelp-search-form">
			<legend><h2>Search/Select Restaurant</h2></legend>
				
                <label>Cuisine (Leave Blank for All Results):
				<input type="text" class="search-input yelp-queryString" placeholder="Mexican, Chinese, Korean..." id="location">		
				</label>
				
				<label>Location:
				<input type="text" class="search-input location yelp-locations" placeholder="Location" id="location">
				</label>

				<button type="submit" class="submit-btn">Search</button>
			
		</form>
	
		
		<div class="results">
			
		</div>
    
        <div class="no-results"></div>

    `
}

// APPEND-PAGE
function appendPage(page){
	backBtnDisabler();
 	forwardBtnDisable();
	selectedEventObj.historyCounter++;	

	$('main').empty()
	$('main').append(page)
	
	if (selectedEventObj.historyCounter=== 2 && selectedEventObj.eventSelected){
		$('.e-search').val(selectedEventObj.eventLocation)
		$('.event-search-form').submit();
	}
	
	if (selectedEventObj.historyCounter=== 3 && selectedEventObj.restaurantSelected){
		$('.yelp-locations').val(selectedEventObj.restaurantLocation)
        $('.yelp-queryString').val(selectedEventObj.zomatoSearchQuery)
		$('.yelp-search-form').submit()
	}
}

// NAVBAR: HOME-LOGO
$('.home-logo').on('click', (e)=>{
    selectedEventObj.historyCounter= 0;
	appendPage(mainPageGenerator())
    selectedEventObj = selectedEventObjReset
	
})

// HAMBURGER-MENU
$('.hamburger').on('click', (e)=>{
	selectedEventObj.showMenu = !selectedEventObj.showMenu

	if (selectedEventObj.showMenu ){
		$('main').hide();
		$('.menu').show()
	} else {
		$('main').show();
		$('.menu').hide()
	}
	
}) 

// HAMBURGER-MENU: HOME
$('.menu .home').on('click', (e)=>{
    selectedEventObj.historyCounter= 0;
	appendPage(mainPageGenerator())
    selectedEventObj = selectedEventObjReset
	$('.menu').hide()
	$('main').show()
	
})

$('.nav-new').on('click', (e)=>{
    selectedEventObj.historyCounter= 0;
	appendPage(mainPageGenerator())
    selectedEventObj = selectedEventObjReset
    
})

// HAMBURGER-MENU: BACK
$('.back').on('click', (e)=>{

	
	$('.menu').hide()
	selectedEventObj.historyCounter= selectedEventObj.historyCounter- 2


	
	appendPage(selectedEventObj.history[selectedEventObj.historyCounter])
	$('main').show()
	
})

// START-BTN
$('main').on('click', '.start-btn', (e)=>{
	appendPage(selectedEventObj.history[selectedEventObj.historyCounter])
	geoLocate()
})

// EVENT-SEARCH-SUBMIT
$('main').on('submit', '.event-search-form', (e)=>{
	e.preventDefault();
	
	$('.results').empty();
    $('.no-results').empty();

	let city = $('.e-search').val().split(',')[0].trim()
	
	let state = $('.e-search').val().split(',')[1].trim()
	
	selectedEventObj.origLocation = `${city}, ${state}`;
	
	let seatGeekURLcityState = `https://api.seatgeek.com/2/events?client_id=${selectedEventObj.seatGeekApiKey}&venue.city=${city}&venue.state=${state}&range=5mi`
	
	fetch(seatGeekURLcityState).then(response=>{
		displayLoader();
		if (response.status === 200){
				return response.json()	
			} else {
                hideLoader()

				throw new Error(response.statusText)
			}
		}).then(responseJson =>{
			console.log(responseJson)
			hideLoader();
			let eventsArr = responseJson.events
			let resultDiv

			if (eventsArr.length === 0){
				
				 resultDiv = `
						<div class="eventResults noResults">
						  No listed events in <span class="noResultsLocation">${city}, ${state}</span>
						</div>`
				 $('.no-results').append(resultDiv)
			} 
		
			for (let i = 0; i < eventsArr.length; i++){
				let eventTitle = eventsArr[i].title 
				let eventDateTime = eventsArr[i].datetime_local
				let eventURL = eventsArr[i].url
				let eventVenue = eventsArr[i].venue.name
				let eventID = eventsArr[i].id
				
				
				let eventPrice = `~$${eventsArr[i].stats.average_price*2}`
				
                
				if (eventPrice === '~$0'){
					eventPrice = 'N/A'
				 }
            
				
				let eventLong = eventsArr[i].venue.location.lon
				let eventLat = eventsArr[i].venue.location.lat
				
				const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${eventLat},${eventLong}&key=${selectedEventObj.googleApiKey}`
				
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
				let googleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${selectedEventObj.origLocation}&destination=${eventAddressURI}`
					
					resultDiv = `
					<div class="eventResults" id=${eventID}>
						<header>${eventTitle}</header>
						<button class="event-select"> SELECT </button>
						<span class="eventDateTime"><i class="far fa-calendar"></i>
							${timeParser(eventDateTime)[0]} @ ${timeParser(eventDateTime)[1]}</span>
						<div class="event-venue-address">
							<span class="eventVenue">${eventVenue}</span>
							<span class="eventAddress">${eventAddress}</span>
							<span class="eventDirections"><i class="fas fa-directions"></i> 
							<a href="${googleMapsLinkURL}" target="_blank" class="google-address">Get Directions</a></span>
						</div>
		
						<span class="event-price">
						<i class="fas fa-ticket-alt"></i>
							Tickets (2): <span class="eventCostVal">${eventPrice}</span></span>
						<a href="${eventURL}" target="_blank"><button class="eventURL">DETAILS</button></a>
					</div>`
				
				$('.results').append(resultDiv)
				})


			}
		})
})

// EVENT-SELECT
$('main').on('click', '.eventResults > .event-select', (e)=>{
	let selectedEventID;
	
	if (e.target.id){
		selectedEventID = e.target.id
	} else {
		selectedEventID = $(e.target).parents('.eventResults')[0].id	
	}
	
	if (e.target.className !== 'eventURL'){
		$(`#${selectedEventID}`).addClass('selected-event')
	}
	
	
	let seatGeekURLbyID = `https://api.seatgeek.com/2/events/${selectedEventID}?client_id=${selectedEventObj.seatGeekApiKey}`
	
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
			
			const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${eventLat},${eventLong}&key=${selectedEventObj.googleApiKey}`

				fetch(googleApiURL).then(response => {
					if (response.status === 200){
						return response.json()	
					} else {
						throw new Error(response.statusText)
					}

				}).then(responseJson =>{
					console.log(responseJson)
		
			
				selectedEventObj.eventSelected= true
				selectedEventObj.eventName= event.title
				selectedEventObj.eventTime= event.datetime_local
				selectedEventObj.eventAddress= responseJson.results[0].formatted_address
				selectedEventObj.eventID=selectedEventID
				selectedEventObj.eventDetailsLink = event.url
				selectedEventObj.eventCoors= {
					lat: event.venue.location.lat,
					long: event.venue.location.lon
				    }
				selectedEventObj.eventVenue= event.venue.name
				selectedEventObj.eventType=event.type
				selectedEventObj.eventLocation= event.venue.display_location
				selectedEventObj.eventCost=event.stats.average_price * 2
			
		
		console.log(selectedEventObj)
		
		// STORE EVENTOBJ IN FIREBASE
		
		axios.post('https://perfect-date-app.firebaseio.com/event.json', selectedEventObj)
			
	
		// MOVE USER TO NEXT-PAGE
		appendPage(foodAndDrinksPageGenerator());		
		
		$('.yelp-locations').val(selectedEventObj.eventLocation)	

	})
})
})

// RESTAURANT-SEARCH-SUBMIT
$('main').on('submit', '.yelp-search-form', (e)=>{
	e.preventDefault();
    
    $('.results').empty();
    $('.no-results').empty();
	
	let zomatoSearchQuery = $('.yelp-queryString').val()
    let zomatoLocation = $('.yelp-locations').val()
    			
	const zomatoApiKey = '9fc6bb49836d20f169da8151581bde82'
	
	let zomatoRadius = 1609.34
    let zomatoApiURL
    
    const headers = {
		"headers": {
		"user-key": "9fc6bb49836d20f169da8151581bde82"
	  }
	}
	
    
    if (zomatoLocation !== selectedEventObj.eventLocation){
        zomatoCity = zomatoLocation.split(',')[0].split(' ').join(
        '+')
        zomatoState= zomatoLocation.split(',')[1].split(' ').join(
        '+')
        let googleGetCoorsURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${zomatoCity}${zomatoState}&key=${selectedEventObj.googleApiKey}`
        
        console.log('newLocation:', googleGetCoorsURL)
        fetch(googleGetCoorsURL).then(response=>{
            displayLoader()
            if (response.status === 200){
                    return response.json()	
                } else {
                    hideLoader()
                    throw new Error(response.statusText)
                }
            }).then(coors =>{
                console.log(coors)
                let newLocationLat = coors.results[0].geometry.location.lat
                let newLocationLng = coors.results[0].geometry.location.lng
                
                console.log(newLocationLat, newLocationLng)

                zomatoApiURL = `https://developers.zomato.com/api/v2.1/search?q=${zomatoSearchQuery}&lat=${newLocationLat}&lon=${newLocationLng}&radius=${zomatoRadius}`

                fetch(zomatoApiURL, headers).then(response=>{
                    displayLoader()
                    if (response.status === 200){
                            return response.json()	
                        } else {
                            throw new Error(response.statusText)
                            hideLoader()
                        }
                    }).then(foodanddrink =>{

                        hideLoader();

                        let foodAndDrinkArr = foodanddrink.restaurants

                        console.log(foodAndDrinkArr)

                        if (foodAndDrinkArr.length === 0){
                            let resultDiv = `
                                    <div class="eventResults noResults">
                                        No <span class="noResultsQuery">${zomatoSearchQuery} </span> restaurants in <span class="noResultsLocation">${selectedEventObj.eventLocation}</span>
                                    </div>`


                                    $('.no-results').append(resultDiv)

                        } else {
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

                                const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${zomatoLat},${zomatoLong}&key=${selectedEventObj.googleApiKey}`

                                fetch(googleApiURL).then(response => {
                                    if (response.status === 200){
                                        return response.json()	
                                    } else {
                                        throw new Error(response.statusText)
                                    }

                                }).then(responseJson =>{

                                let zomatoAddress = responseJson.results[0].formatted_address
                                let addressArr = zomatoAddress.split(' ')
                                let zomatoAddressURI = addressArr.join('+')
                                let eventAddressURI = selectedEventObj.eventAddress.split(' ').join('+')
                                let googleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${eventAddressURI}&destination=${zomatoAddressURI}`	



                                let resultDiv = `
                                    <div class="zomatoResults" id=${zomatoID}>
                                        <header>${zomatoName}</header>
                                        <button class="event-select"> SELECT </button>

                                        <span class="eventDateTime">
										<i class="fas fa-utensils"></i>				
										<i>${zomatoCuisines}</i></span>

                                        <span class="zomato-ratings">
										Ratings: <strong>${zomatoRatings}/5</strong></span>

                                        <div class="event-venue-address">
                                            <span class="eventAddress">${zomatoAddress}
											</span>
											<span class="eventDirections">
												<i class="fas fa-directions"></i> 
													<a href="${googleMapsLinkURL}" target="_blank" class="google-address">Get Directions</a>
											</span>
										
                                        </div>
                                         <span class="zomato-price">
											Dinner for 2: <strong>~$${zomatoPrice}</strong></span>

                                        <div class="result-btns-wrapper">
                                            <a href="${zomatoMenuURL}" target="_blank"><button class="eventURL">MENU</button></a>
                                            <a href="${zomatoDetailsURL}" target="_blank"><button class="eventURL">DETAILS</button></a>
                                        </div>
                                    </div>`

                                   $('.results').append(resultDiv)

                                })

                            }
                        }
                })
            })
    } else {

        zomatoApiURL = `https://developers.zomato.com/api/v2.1/search?q=${zomatoSearchQuery}&lat=${selectedEventObj.eventCoors.lat}&lon=${selectedEventObj.eventCoors.long}&radius=${zomatoRadius}`



        fetch(zomatoApiURL, headers).then(response=>{
            displayLoader()
            if (response.status === 200){
                    return response.json()	
                } else {
                    throw new Error(response.statusText)
                    hideLoader()
                }
            }).then(foodanddrink =>{

                hideLoader();

                let foodAndDrinkArr = foodanddrink.restaurants

                console.log(foodAndDrinkArr)

                if (foodAndDrinkArr.length === 0){
                    let resultDiv = `
                            <div class="eventResults noResults">
                                No <span class="noResultsQuery">${zomatoSearchQuery} </span> restaurants in <span class="noResultsLocation">${selectedEventObj.eventLocation}</span>
                            </div>`


                            $('.no-results').append(resultDiv)

                } else {
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

                        const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${zomatoLat},${zomatoLong}&key=${selectedEventObj.googleApiKey}`

                        fetch(googleApiURL).then(response => {
                            if (response.status === 200){
                                return response.json()	
                            } else {
                                throw new Error(response.statusText)
                            }

                        }).then(responseJson =>{

                        let zomatoAddress = responseJson.results[0].formatted_address
                        let addressArr = zomatoAddress.split(' ')
                        let zomatoAddressURI = addressArr.join('+')
                        let eventAddressURI = selectedEventObj.eventAddress.split(' ').join('+')
                        let googleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${eventAddressURI}&destination=${zomatoAddressURI}`	



                        let resultDiv = `
                            <div class="zomatoResults" id=${zomatoID}>
                                        <header>${zomatoName}</header>
                                        <button class="event-select"> SELECT </button>

                                        <span class="eventDateTime">
										<i class="fas fa-utensils"></i>	 			
				
										<i>${zomatoCuisines}</i></span>

                                        <span class="zomato-ratings">Ratings: <strong>${zomatoRatings}/5</strong></span>

                                        <div class="event-venue-address">
                                            <span class="eventAddress">${zomatoAddress}
											</span>
											<span class="eventDirections">
												<i class="fas fa-directions"></i> 
													<a href="${googleMapsLinkURL}" target="_blank" class="google-address">Get Directions</a>
											</span>
										
                                        </div>
										   <span class="zomato-price">
											Dinner for 2: <strong>~$${zomatoPrice}</strong></span>

                                        <div class="result-btns-wrapper">
                                            <a href="${zomatoMenuURL}" target="_blank"><button class="eventURL">MENU</button></a>
                                            <a href="${zomatoDetailsURL}" target="_blank"><button class="eventURL">DETAILS</button></a>
                                        </div>
                                    </div>`

                           $('.results').append(resultDiv)
						


                    })

                }
           }
        })
    }
})

// RESTAURANT-SELECT
$('main').on('click', '.zomatoResults > .event-select', (e)=>{
	
	let selectedEventID;
    
    let cuisineQuery = $('.yelp-queryString').val()
	
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
				
				
				const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${zomatoLat},${zomatoLong}&key=${selectedEventObj.googleApiKey}`

				
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
                    selectedEventObj.zomatoSearchQuery = cuisineQuery
                    
                    
                    let city = selectedEventObj.restaurantAddress.split(',')[1]
                    let state = selectedEventObj.restaurantAddress.split(',')[2].split(' ')[1]
                    
                    
                   let selectedRestaurantAddy = `${city}, ${state}`
                    
                    selectedEventObj.restaurantLocation = selectedRestaurantAddy
                    
							 let finalPageHTML = `
						
								<header class="itin-msg">
									<h2>Date Summary</h2>
								</header>

								<div class="date-details">

									<div class="cost">
										<header><h1>Estimated Total Cost</h1></header>

										<span class="event-tickets">
										<span class="names">1. ${selectedEventObj.eventName}</span>: <span class="costVal">$${selectedEventObj.eventCost}</span></span>

										<span class="dinner-price">
											<span class="names">2. ${selectedEventObj.restaurantName}</span>: <span class="costVal">$${selectedEventObj.restaurantCost}</span></span>
											<span class="total-cost">Total: <span class="costVal">$${Number(selectedEventObj.eventCost + selectedEventObj.restaurantCost)}</span></span>
									</div>



									<div class="event-restaurant-details-wrapper">
										<div class="event-details">
											<header>
												<h1>
													<span class="event-name">${selectedEventObj.eventName}</span>
												</h1>
											</header>

										<span class="event-time">
												
												<i class="far fa-calendar"></i>
					
												${timeParser(selectedEventObj.eventTime)[0]} @ ${timeParser(selectedEventObj.eventTime)[1]}
											</span>

										<div class="event-venue-address">
											<span class="eventVenue">${selectedEventObj.eventVenue}</span>
										<span class="eventAddress">
											${selectedEventObj.eventAddress}</span>

										<span class="eventDirections">
											<i class="fas fa-directions"></i> 
							
											<a href="${eventGoogleMapsLinkURL}" target="_blank" class="google-address">Get Directions</a></span>
										</div>
										
									
											<a href="${selectedEventObj.eventDetailsLink}" target="_blank"><button class="event-link">Details</button></a>
										</div>

										<div class="restaurant-details">
											<header><h1><span class="restaurant-name">${selectedEventObj.restaurantName}</span></h1></header>
											<span class="restaurant-foodType">
											
											<i class="fas fa-utensils"></i>	 

											<i>${selectedEventObj.restaurantFoodType}</i></span>
										<span class="restaurant-address">
											${selectedEventObj.restaurantAddress}</span>

										<span class="eventDirections">
											<i class="fas fa-directions"></i> 
							
											<a href="${restaurantGoogleMapsLinkURL}" target="_blank" class="google-address">Get Directions</a>
										</span>
										

										<div class="restaurant-btns-wrapper">
													<a href="${selectedEventObj.restaurantMenu}" target="_blank"><button class="restaurant-menu">Menu</button></a>
													<a href="${selectedEventObj.restaurantDetails}" target="_blank"><button class="restaurant-link">Details</button></a>
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


start()