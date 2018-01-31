/**
* ARITHMETIC OPERATIONS FOR WAA NODES (with a signal focus)
*
* usage: addition = new addSignals(inputA, inputB, audioContext);
*
* Adán L. Benito
**/

function addSignals(inputA, inputB, context) {
  this.context = context;
  this.addGain = this.context.createGain();
  this.addGain.gain.value = 1;
  this.inputA.connect(this.addGain);
  this.inputB.connect(this.addGain);
  this.connect = function(destination) {
    this.addGain.connect(destination);
  };
  this.disconnect = function(destination) {
    this.addGain.disconnect(destination);
  };
};

function substractSignals(inputA, inputB, context) {
  this.context = context;
  this.invertGain = this.context.createGain();
  this.invertGain.gain.value = -1;
  this.substractGain = this.context.createGain();
  this.substractGain.gain.value = 1;
  this.inputB.connect(this.invertGain);
  this.invertGain.connect(this.substractGain);
  this.inputA.connect(this.substractGain);
  this.connect = function(destination) {
    this.substractGain.connect(destination);
  };
  this.disconnect = function(destination) {
    this.substractGain.disconnect(destination);
  };
};

function multiplySignals (inputA, inputB, context) {
  this.context = context;
  this.multGain = this.context.createGain();
  this.multGain.gain.value = 0;
  this.inputA.connect(this.multGain);
  this.inputB.connect(this.multGain.gain);
  this.connect = function(destination) {
    this.multGain.connect(destination);
  };
  this.disconnect = function(destination) {
    this.multGain.disconnect(destination);
  };
};

function invertSignal (input, context) {
  this.context = context;
  this.inverter = this.context.createWaveShaper();

  this.invertCurve = function(N) {
    var curve = new Float32Array(N);
    var K = (N-1)/2;
    for (var i=0; i<N; i++) {
      var k = (i-K)/K;
      curve[i] = 1/k;
    };
    return curve;
  };

  inverter.oversample = '4x';
  inverter.curve = this.invertCurve(1025);

  this.input.connect(inverter);

  this.connect = function(destination) {
    this.inverter.connect(destination);
  };
  this.disconnect = function(destination) {
    this.inverter.disconnect(destination);
  };
};

function divideSignals (inputA, inputB, context) {
  this.context = context;
  this.invB = new invertSignal(inputB, this.context);
  this.mult = new multiplySignals(inputA, invB, this.context);

  this.connect = function(destination) {
    this.mult.connect(destination);
  };
  this.disconnect = function(destination) {
    this.mult.disconnect(destination);
  };
};

function linearRamp (startValue, endValue, length, context) {
  this.context = context;
  this.startValue = startValue;
  this.endValue = endValue;
  this.length = length;

  this.constant = this.context.createConstantSource();
  this.constant.offset.value = 0;
  this.constant.start();
  this.connect = function(destination) {
    this.constant.connect(destination);
  };
  this.disconnect = function(destination) {
    this.constant.disconnect(destination);
  };
  this.trigger = function() {
    var now = plugin.context.currentTime;
    this.constante.offset.cancelScheduledValues(now);
    this.constant.offset.setValueAtTime(this.startValue, now);
    this.constant.offset.linearRampToValueAtTime(this.endValue, now + length);
  };
  this.reset = function(value) {
    this.value = value || 0;
    var now = plugin.context.currentTime;
    this.constante.offset.cancelScheduledValues(now);
    this.constant.offset.setValueAtTime(this.value, now);
  };
};
