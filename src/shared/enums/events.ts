export enum Events {
    // CitizenFX Events
    gameEventTriggered = "gameEventTriggered",
    entityCreated = "entityCreated",
    entityCreating = "entityCreating",
    entityRemoved = "entityRemoved",
    resourceListRefreshed = "onResourceListRefresh",
    resourceStart = "onResourceStart",
    resourceStarting = "onResourceStarting",
    resourceStop = "onResourceStop",
    serverResourceStart = "onServerResourceStart",
    serverResourceStop = "onServerResourceStop",
    playerConnecting = "playerConnecting",
    playerEnteredScope = "playerEnteredScope",
    playerLeftScope = "playerLeftScope",
    playerConnected = "playerJoining",
    playerDropped = "playerDropped",
  
    // Hunting Server Events
    resourceRestarted = "qb-hunting-server:resourceRestarted",
    harvestAnimal = "qb-hunting-server:harvestAnimal",
    pickupTent = "qb-hunting-server:pickupTent",
    destroyFire = "qb-hunting-server:destroyFire",
    cookMeat = "qb-hunting-server:cookMeat",
    sellItem = "qb-hunting-server:sellItem",
    buyItem = "qb-hunting-server:buyItem",

    // Hunting Client Events
    placeProp = "qb-hunting-client:placeProp",
    syncCampingData = "qb-hunting-client:syncCampingData",
    startCampManager = "qb-hunting-client:startCampManager",
    progressBar = "qb-hunting-client:progressBar",
 }