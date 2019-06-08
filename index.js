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
                zomatoSearchQuery: '',
				costSlide: false,
				eventSlide: false,
				restaurantSlide: false
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

// AUTO-COMPLETE ACTIVATORS
function activateEventLocationSearch(){
            let eventLocationInput = document.getElementById('event-location')
            let autocomplete = new google.maps.places.Autocomplete(eventLocationInput)
        }

function activateRestaurantLocationSearch(){
            let restaurantLocationInput = document.getElementById('restaurant-location')
            let autocomplete = new google.maps.places.Autocomplete(restaurantLocationInput)
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
				<label>Location (format: city, state-code)
					<input type="text" class="search-input e-search location" placeholder="Location" id="event-location">
				</label>
				<button type="submit" class="submit-btn">Search</button>
		</form>

		<div class="results"></div>

	    <div class="no-results"></div>

	   <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDOvfuKaaRuYocVQWNl9ICi3wadIephDyc&libraries=places&callback=activateEventLocationSearch"></script>
`
}

// PAGE-GENERATOR: RESTAURANTS
function foodAndDrinksPageGenerator(){
	return `
		<form action="" class="yelp-search-form">
			<legend><h2>Search/Select Restaurant</h2></legend>
				
                <label>Cuisine (Leave Blank for All Results):
				<input type="text" class="search-input yelp-queryString" placeholder="Mexican, Chinese, Korean..." id="cuisine">		
				</label>
				
				<label>Location:
				<input type="text" class="search-input location yelp-locations" placeholder="Location" id="restaurant-location">
				</label>

				<button type="submit" class="submit-btn">Search</button>
			
		</form>
	
		
		<div class="results">
			
		</div>
    
        <div class="no-results"></div>

        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDOvfuKaaRuYocVQWNl9ICi3wadIephDyc&libraries=places&callback=activateRestaurantLocationSearch"></script>
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
	}
	
	if (selectedEventObj.historyCounter=== 3 && selectedEventObj.restaurantSelected){
		$('.yelp-locations').val(selectedEventObj.restaurantLocation)
        $('.yelp-queryString').val(selectedEventObj.zomatoSearchQuery)
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
    
    displayLoader();

	$('.results').empty();
    $('.no-results').empty();

	let city = $('.e-search').val().split(',')[0].trim()
	
	let state = $('.e-search').val().split(',')[1].trim()
    
	selectedEventObj.origLocation = `${city}, ${state}`;
	
	let seatGeekURLcityState = `https://api.seatgeek.com/2/events?client_id=${selectedEventObj.seatGeekApiKey}&venue.city=${city}&venue.state=${state}&range=5mi`
	
	fetch(seatGeekURLcityState).then(response=>{
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
				let eventIMG = eventsArr[i].performers[0].image
                let eventCoors = {
                    lat: eventsArr[i].venue.location.lat,
                    lon: eventsArr[i].venue.location.lon
                }

				
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
				console.log(eventAddress)
				
				let eventAddressSplit = eventAddress.split(',')
				
				let eventStreet = eventAddressSplit[0]
				let eventCity = eventAddressSplit[1].substring(1)
				let eventStateZip = eventAddressSplit[2].substring(1)

				let addressArr = eventAddress.split(' ')
				let eventAddressURI = addressArr.join('+')
				let googleMapsLinkURL = `https://www.google.com/maps/dir/?api=1&origin=${selectedEventObj.origLocation}&destination=${eventAddressURI}`
                
                
					resultDiv = `
					<div class="eventResults" id=${eventID}>
						<header>${eventTitle}</header>
						<button class="event-select"> SELECT </button>
						<span class="eventDateTime">
									<i class="far fa-calendar"></i>
									${timeParser(eventDateTime)[0]} @ ${timeParser(eventDateTime)[1]}
								</span>
						<div class="responsive-div">

							<div class="responsive-left">

								<div class="event-img-wrapper">
									<img src="${eventIMG}" class="event-img">
								</div>
							</div>
							<div class="responsive-right">
								
								<div class="event-venue-address">
									<span class="eventVenue">${eventVenue}</span>

									<span class="eventAddress">
										<span class="eventStreet">${eventStreet}</span>
										<span class="eventCityStateZip">${eventCity}, ${eventStateZip}</span>
									</span>

									<span class="eventDirections">
										<i class="fas fa-directions"></i> 
										<a href="${googleMapsLinkURL}" target="_blank" class="google-address">Get Directions</a>
									</span>
								</div>

								<span class="event-price">
									<i class="fas fa-ticket-alt"></i> Price x 2: <span class="eventCostVal">${eventPrice}</span>

								<div class="event-btn-wrapper">
									<a href="${eventURL}" target="_blank">
										<button class="eventURL">TICKETS</button>
									</a>
								</div>
							</div>

						</div>
						</div>`
								
		

				$('.results').append(resultDiv)
					
				let imgArr = $('.event-img')
				
				console.log(imgArr)
				for (let i = 0 ; i < imgArr.length; i++){
					if(imgArr[i].src.includes('null')){
						imgArr[i].parentNode.append('image not available')
						imgArr[i].remove()

					}
				}
				})
			}
		})
})

    


// EVENT-SELECT
$('main').on('click', '.eventResults > .event-select', (e)=>{
	
    let selectedEventID;
    
	displayLoader()
    
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
		
		if (response.status === 200){
				return response.json()	
			} else {
				throw new Error(response.statusText)
				hideLoader();
			}
		}).then(event =>{	
			
			hideLoader();
			console.log(event)
			
			selectedEventObj.eventIMG = event.performers[0].image
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
    displayLoader()

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
        
        fetch(googleGetCoorsURL).then(response=>{
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
								let zomatoIMG = foodAndDrinkArr[i].restaurant.thumb


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
								
								let zomatoAddressSplit = zomatoAddress.split(',')
								let zomatoStreet = zomatoAddressSplit[0]
								let zomatoCity = zomatoAddressSplit[1].substring(1)
								let zomatoStateZip = zomatoAddressSplit[2].substring(1)
								
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
											<i>${zomatoCuisines}</i>
										</span>
		
										 <span class="zomato-ratings">
											Ratings: <strong>${zomatoRatings}/5</strong>
										</span>

										<div class="zomato-img-wrapper">
											<img src="${zomatoIMG}" class="zomato-img">
										</div>

                                        <div class="event-venue-address">
                                            <span class="eventAddress">
												<span class="zomatoStreet">${zomatoStreet}</span>
												<span class="zomatoCityStateZip">${zomatoCity}, ${zomatoStateZip}</span>
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
									
									let imgArr = $('.zomato-img')
								
										console.log(imgArr)
									for (let i = 0 ; i < imgArr.length; i++){
										if(!imgArr[i].src.includes('zmtcdn')){
											imgArr[i].parentNode.append('image not available')
											imgArr[i].remove()
										}
									}
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
						let zomatoIMG = foodAndDrinkArr[i].restaurant.thumb

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
						
						let zomatoAddressSplit = zomatoAddress.split(',')
						let zomatoStreet = zomatoAddressSplit[0]
						let zomatoCity = zomatoAddressSplit[1].substring(1)
						let zomatoStateZip = zomatoAddressSplit[2].substring(1)
								
								
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
										
										<div class="responsive-div">
											<div class="responsive-left">

												<div class="zomato-img-wrapper">
													<img src="${zomatoIMG}" class="zomato-img">
												</div>
										</div>
											
										<div class="responsive-right">
											<span class="zomato-ratings">Ratings: <strong>${zomatoRatings}/5</strong></span>

											<div class="event-venue-address">
												<span class="eventAddress">
													<span class="zomatoStreet">${zomatoStreet}</span>
													<span class="zomatoCityStateZip">${zomatoCity}, ${zomatoStateZip}</span>
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
										</div>
                                    </div>`

                           			$('.results').append(resultDiv)
						
									let imgArr = $('.zomato-img')
								
										console.log(imgArr)
									for (let i = 0 ; i < imgArr.length; i++){
										if(!imgArr[i].src.includes('zmtcdn')){
											imgArr[i].parentNode.append('image not available')
											imgArr[i].remove()
										}
									}

                    })

                }
           }
        })
    }
})

// RESTAURANT-SELECT
$('main').on('click', '.zomatoResults > .event-select', (e)=>{
	
    displayLoader()

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
			if (response.status === 200){
					return response.json()	
				} else {
					throw new Error(response.statusText)
					hideLoader()
				}
			}).then(resDetails =>{
				
			
				console.log(resDetails)
			
				let zomatoLong = resDetails.location.longitude
				let zomatoLat = resDetails.location.latitude
				selectedEventObj.restaurantIMG = resDetails.thumb
				
				
				const googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${zomatoLat},${zomatoLong}&key=${selectedEventObj.googleApiKey}`

				
				fetch(googleApiURL).then(response => {
					if (response.status === 200){
						return response.json()	
					} else {
						throw new Error(response.statusText)
					}

				}).then(responseJson =>{
                    hideLoader();

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
						

								<div class="date-details">
                                    <header class="itin-msg"><h1> Your Date Details </h1></header>

									<div class="cost">
										<header class="cost-header">
											<span class="cost-header-label date-details-clicked">Estimated Total Cost</span>
                                            <h1><span class="cost-header-after">Estimated Total Cost</span></h1>
											<i class="fas fa-angle-double-down"></i>
											<i class="fas fa-angle-double-up"></i>
										</header>

										<div class="cost-unfold unfold">
											<span class="event-tickets">
											<span class="names">1. ${selectedEventObj.eventName}</span>: <span class="costVal">$${selectedEventObj.eventCost}</span></span>

											<span class="dinner-price">
												<span class="names">2. ${selectedEventObj.restaurantName}</span>: <span class="costVal">$${selectedEventObj.restaurantCost}</span></span>
												<span class="total-cost">Total: <span class="costVal">$${Number(selectedEventObj.eventCost + selectedEventObj.restaurantCost).toFixed(2)}</span></span>
											</div>
										</div>



									<div class="event-restaurant-details-wrapper">

										<div class="event-details">
											<header class="event-header">
                                                <span class="event-header-label date-details-clicked">Event Details</span>
												<h1><span class="event-name">${selectedEventObj.eventName}</span></h1>
												<i class="fas fa-angle-double-down"></i>
												<i class="fas fa-angle-double-up"></i>
											</header>

										<div class="event-unfold unfold">

											<span class="event-time">

													<i class="far fa-calendar"></i>

													${timeParser(selectedEventObj.eventTime)[0]} @ ${timeParser(selectedEventObj.eventTime)[1]}
												</span>
										<div class="responsive-div">
											<div class="responsive-left">
												<div class="event-img-wrapper">
													<img src="${selectedEventObj.eventIMG}" class="event-img">
												</div>
											</div>
										<div class="responsive-right">
											<div class="event-venue-address">
													<span class="eventVenue">${selectedEventObj.eventVenue}</span>
												<span class="eventAddress">
													<span class="eventStreet">${selectedEventObj.eventAddress.split(',')[0]}</span>
													<span class="eventCityStateZip">${selectedEventObj.eventAddress.split(',')[1].substring(1)}, ${selectedEventObj.eventAddress.split(',')[2].substring(1)}</span>
												</span>

												<span class="eventDirections">
													<i class="fas fa-directions"></i> 

													<a href="${eventGoogleMapsLinkURL}" target="_blank" class="google-address">Get Directions</a>
												</span>
											</div>

											<div class="restaurant-btns-wrapper">
													<a href="${selectedEventObj.eventDetailsLink}" target="_blank"><button class="event-link">TICKETS</button></a>
											</div>

										</div>
									</div>
								</div>
							</div>

										<div class="restaurant-details">
											<header class="restaurant-header">
                                            <span class="restaurant-header-label date-details-clicked">Restaurant Details</span>

												<h1><span class="restaurant-name">${selectedEventObj.restaurantName}</span></h1>
												<i class="fas fa-angle-double-down"></i>
												<i class="fas fa-angle-double-up"></i>
											</header>
											
										<div class="restaurant-unfold unfold">
											<span class="restaurant-foodType">

												<i class="fas fa-utensils"></i>	 

												<i>${selectedEventObj.restaurantFoodType}</i></span>
									<div class="responsive-div">
										<div class="responsive-left">
											<div class="zomato-img-wrapper">
												<img src="${selectedEventObj.restaurantIMG}" class="zomato-img">
											</div>
										</div>

										<div class="responsive-right">
											<span class="restaurant-address">
												<span class="eventStreet">${selectedEventObj.restaurantAddress.split(',')[0]}</span>
												<span class="eventCityStateZip">${selectedEventObj.restaurantAddress.split(',')[1].substring(1)}, ${selectedEventObj.restaurantAddress.split(',')[2].substring(1)}</span>
											</span>

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

									</div>

										`
							
							appendPage(finalPageHTML)
                            $('.cost-header-after').hide()
							$('.cost-unfold').hide()
							$('.event-unfold').hide()
							$('.event-name').hide()
							$('.restaurant-unfold').hide()
							$('.restaurant-name').hide()
							$('.fa-angle-double-up').hide()
                    
                            console.log($('.event-header').css('height'))
                    
                  
							let zomatoIMGArr = $('.zomato-img')
								
									for (let i = 0 ; i < zomatoIMGArr.length; i++){
										if(!zomatoIMGArr[i].src.includes('zmtcdn')){
											zomatoIMGArr[i].parentNode.append('image not available')
											zomatoIMGArr[i].remove()
										}
									}													
							let eventIMGArr = $('.event-img')
		
									for (let i = 0 ; i < eventIMGArr.length; i++){
										if(eventIMGArr[i].src.includes('null')){
											eventIMGArr[i].parentNode.append('image not available')
											eventIMGArr[i].remove()
										}
									}
					
						
							console.log(selectedEventObj)
						})
					})
})

$('main').on('click', '.cost-header' , (e)=>{
	
	if (!selectedEventObj.costSlide){
		$('.cost-unfold').hide()
		$('.cost-unfold').slideDown()
        
		$('.cost-header .fa-angle-double-down').hide()
		$('.cost-header .fa-angle-double-up').show()
		
        $('.cost-header-label').slideUp()
        
        $('.cost-header-after').slideDown()
        
		$('.cost-header').addClass('date-details-clicked')
        
		selectedEventObj.costSlide = true
	} else {
		$('.cost-unfold').slideUp()

        $('.cost-header .fa-angle-double-down').show()
		$('.cost-header .fa-angle-double-up').hide()
        
        $('.cost-header-after').slideUp()
        
        $('.cost-header-label').slideDown()

		
		$('.cost-header').removeClass('date-details-clicked')

		selectedEventObj.costSlide = false
	}
})

$('main').on('click', '.event-header' , (e)=>{
	if (!selectedEventObj.eventSlide){
		$('.event-unfold').hide()
		$('.event-unfold').slideDown()
        
		$('.event-header .fa-angle-double-down').hide()
		$('.event-header .fa-angle-double-up').show()
        
        $('.event-header-label').slideUp()

        $('.event-name').slideDown()
        
        
		$('.event-header').addClass('date-details-clicked')
        
		selectedEventObj.eventSlide = true
	} else {

        $('.event-unfold').slideUp()

		$('.event-header .fa-angle-double-down').show()
		$('.event-header .fa-angle-double-up').hide()
        
        $('.event-name').slideUp()

        $('.event-header-label').slideDown()
        

		$('.event-header').removeClass('date-details-clicked')

		selectedEventObj.eventSlide = false
	}
})

$('main').on('click', '.restaurant-header' , (e)=>{
	if (!selectedEventObj.restaurantSlide){
		$('.restaurant-unfold').hide()
		$('.restaurant-unfold').slideDown()
        
        $('.restaurant-header .fa-angle-double-down').hide()
        $('.restaurant-header .fa-angle-double-up').show()
        
        $('.restaurant-header-label').slideUp()
        
        $('.restaurant-name').slideDown()
        
        $('.restaurant-header').slideDown()
        
        $('.restaurant-header').addClass('date-details-clicked')
        
		selectedEventObj.restaurantSlide = true
	} else {
		$('.restaurant-unfold').slideUp()

        $('.restaurant-header .fa-angle-double-down').show()
        $('.restaurant-header .fa-angle-double-up').hide()
        
        $('.restaurant-name').slideUp()
        
        $('.restaurant-header-label').slideDown()
        
        $('.restaurant-header').removeClass('date-details-clicked')

		selectedEventObj.restaurantSlide = false
	}
})


start()