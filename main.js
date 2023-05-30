const carCansav = document.getElementById("myCanvas");
carCansav.width = 200;

const networkCansav = document.getElementById("network");
networkCansav.width = 300;

const carCtx = carCansav.getContext("2d");
const networkCtx = networkCansav.getContext("2d");

const road = new Road(carCansav.width / 2, carCansav.width * 0.9);
const car = new Car(road.getLaneCanter(1), 100, 30, 50, "AI");
const traffic = [
    new Car(road.getLaneCanter(1), -100, 30, 50, "DUMMY", 2)
];

animate();
function animate() {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    car.update(road.borders, traffic);

    carCansav.height = window.innerHeight;
    networkCansav.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y + carCansav.height * 0.8);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }
    car.draw(carCtx);

    carCtx.restore();
    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
} 