import { add, subtract, multiply, divide } from "./calculator";

console.log("Calculator demo");
console.log("add(10, 5)      =", add(10, 5));       // 15
console.log("subtract(10, 5) =", subtract(10, 5));   // 5
console.log("multiply(10, 5) =", multiply(10, 5));   // 50
console.log("divide(10, 5)   =", divide(10, 5));     // should be 2, will print 50
