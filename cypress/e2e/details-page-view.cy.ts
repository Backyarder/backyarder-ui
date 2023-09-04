describe('Details Page', () => {
  it('Check all details are viewable on the plant details page', () => {
    cy.visit('http://localhost:3000/')
    //stubb plants
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/plants', {
      statusCode: 200,
      fixture: 'onload-plants.json'
    })
    //stubb gardens
    cy.intercept('GET', 'https://backyarder-be-47454958a7d2.herokuapp.com/api/v1/garden', {
      statusCode: 200,
      fixture: 'onload-grid.json'
    })
    //stubb plant-details -- need to nake the fixture

    //click on plant
    //??? check to see if loading is displayed
    //await details
    //check that everything is there
      //name
      //home button
      //scientific name
      //sun req
      // cycle
      // watering
      //zones
      //plant type
      //colors

      //watering des
      //light des
      //pruning des

      //more info
        //wildlife
          //types
        //flowering
        //pruned
          //months
        //drought tolerant
        //pet safe
        //indoor
        //edible
        //maintenance
        //non-invasive
  })
})