/** Rename vars */
var Neat    = neataptic.Neat;
var Methods = neataptic.Methods;
var Config  = neataptic.Config;
var Architect = neataptic.Architect;

/** Turn off warnings */
Config.warnings = false;

/** Settings */
var WIDTH            = $(window).width();
var HEIGHT           = $(window).height();
var MAX_SPEED        = 10;
var START_X          = WIDTH/2;
var START_Y          = HEIGHT/2;
var SCORE_RADIUS     = 100;

// GA settings
//var PLAYER_AMOUNT    = Math.round(2.3e-4 * WIDTH * HEIGHT);
var PLAYER_AMOUNT    = 100;
var ITERATIONS       = 100;
var MUTATION_RATE    = 0.8;
var ELITISM          = Math.round(0.1 * PLAYER_AMOUNT);

// Trained population
var USE_TRAINED_POP = false;

/** Global vars */
var neat;
var players = [];
/** Construct the genetic algorithm */
function initNeat(){
  neat = new Neat(
    6, 2,
    null,
    {
      mutation: [
        Methods.Mutation.ADD_NODE,
        Methods.Mutation.SUB_NODE,
        Methods.Mutation.ADD_CONN,
        Methods.Mutation.SUB_CONN,
        Methods.Mutation.MOD_WEIGHT,
        Methods.Mutation.MOD_BIAS,
        Methods.Mutation.MOD_ACTIVATION,
        Methods.Mutation.ADD_GATE,
        Methods.Mutation.SUB_GATE,
        Methods.Mutation.ADD_SELF_CONN,
        Methods.Mutation.SUB_SELF_CONN,
        Methods.Mutation.ADD_BACK_CONN,
        Methods.Mutation.SUB_BACK_CONN
      ],
      popsize: PLAYER_AMOUNT,
      mutationRate: MUTATION_RATE,
      elitism: ELITISM
    }
  );

  if(USE_TRAINED_POP){
    neat.population = population;
  }
  
  //for(var v=0;v< neat.population.length;v++) neat.population[v].popIdx = v
    //console.log(neat.population.length)
  //console.log(JSON.stringify(neat.population[0]))
  // Draw the first graph
  drawGraph(neat.population[0].graph($('.best').width()/2, $('.best').height()/2), '.best');
}

/** Start the evaluation of the current generation */
function startEvaluation(){
  //console.log('population: ' + neat.population.length)
  highestScore = 0;

  //for(var genome in neat.population){
  for(var v=0;v<neat.population.length;v++){
    genome = neat.population[v];
    if(!players[v]){
      //console.log('didnt exist')
      players.push()
      players[v] = new Player(genome, v);
    } else {
      //console.log('existed')
      var oldPos = players[v].getPos()
      var oldScore = players[v].getScore()
      //console.log(oldScore, oldPos)
      players.splice(v,1)
      players[v] = new Player(genome, v);
      players[v].setPos(oldPos)
      players[v].setScore(oldScore * .5)
    }
  }

  walker.reset();
}



/** End the evaluation of the current generation */
function endEvaluation(){
  //console.log('Generation:', neat.generation, '- average score:', Math.round(neat.getAverage()));
  //console.log('Fittest score:', Math.round(neat.getFittest().score));

  // Networks shouldn't get too big
  for(var genome in neat.population){
    genome = neat.population[genome];
    //genome.score -= genome.nodes.length * SCORE_RADIUS / 10;
    genome.score -= genome.nodes.length * SCORE_RADIUS / 50;
  }

  // Sort the population by score
  neat.sort();

  // Draw the best genome
  drawGraph(neat.population[0].graph($('.best').width()/2, $('.best').height()/2), '.best');

  // Init new pop
  var newPopulation = [];

  // Elitism
  for(var i = 0; i < neat.elitism; i++){
    newPopulation.push(neat.population[i]);
    //newPopulation[i].brainIdx = i
  }

  // Breed the next individuals
  for(var i = 0; i < neat.popsize - neat.elitism; i++){
    newPopulation.push(neat.getOffspring());
  }

  // Replace the old population with the new population
  neat.population = newPopulation;
  neat.mutate();

  neat.generation++;
  $('#generation').html(neat.generation)
  startEvaluation();
}
