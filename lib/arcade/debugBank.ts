// Debug It challenge bank.
// Each challenge says what the code should do, shows code with one bug, and
// offers four replacements for the buggy line. `bugLine` is 1-based and
// `answer` is the index (0-3) of the correct fix. Append new challenges with a
// unique id.
import type { Lang } from "./highlight";
import type { Difficulty } from "./questionBank";

export type DebugChallenge = {
  id: string;
  lang: Lang;
  difficulty: Difficulty;
  goal: string;
  lines: string[];
  bugLine: number;
  fixes: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
};

export const DEBUG_CHALLENGES: DebugChallenge[] = [
  // ---------- Python ----------
  {
    id: "dbg-py-range", lang: "python", difficulty: "easy",
    goal: "Print the numbers 1 to 5.",
    lines: ["for i in range(1, 5):", "    print(i)"],
    bugLine: 1,
    fixes: ["for i in range(0, 5):", "for i in range(1, 6):", "for i in range(5):", "for i in range(1, 5, 1):"], answer: 1,
    explanation: "range stops before its end value, so range(1, 5) gives 1 to 4. The end must be 6 to include 5.",
  },
  {
    id: "dbg-py-name", lang: "python", difficulty: "easy",
    goal: "Return the average of a list of numbers.",
    lines: ["def average(nums):", "    total = sum(nums)", "    return total / len(num)"],
    bugLine: 3,
    fixes: ["    return total // len(nums)", "    return sum / len(nums)", "    return total / len(nums)", "    return total / nums"], answer: 2,
    explanation: "The parameter is called nums, so len(num) raises a NameError. // would also be wrong because it drops the decimal part.",
  },
  {
    id: "dbg-py-assign-compare", lang: "python", difficulty: "medium",
    goal: "Return True when n is even.",
    lines: ["def is_even(n):", "    if n % 2 = 0:", "        return True", "    return False"],
    bugLine: 2,
    fixes: ["    if n % 2 == 0:", "    if n / 2 == 0:", "    if n % 2 == 1:", "    if n % 2 => 0:"], answer: 0,
    explanation: "= assigns a value and is a syntax error inside if. Comparison needs ==.",
  },
  {
    id: "dbg-py-recursion", lang: "python", difficulty: "medium",
    goal: "Return the factorial of n.",
    lines: ["def fact(n):", "    if n == 0:", "        return 1", "    return n * fact(n)"],
    bugLine: 4,
    fixes: ["    return n * fact(n + 1)", "    return fact(n - 1)", "    return n * fact(n - 1)", "    return n * n"], answer: 2,
    explanation: "fact(n) calls itself with the same n forever and hits the recursion limit. Each call must move towards the base case with n - 1.",
  },
  {
    id: "dbg-py-binary-search", lang: "python", difficulty: "hard",
    goal: "Binary search: return the index of target in the sorted list, or -1.",
    lines: [
      "def search(a, target):",
      "    lo, hi = 0, len(a) - 1",
      "    while lo < hi:",
      "        mid = (lo + hi) // 2",
      "        if a[mid] == target:",
      "            return mid",
      "        if a[mid] < target:",
      "            lo = mid + 1",
      "        else:",
      "            hi = mid - 1",
      "    return -1",
    ],
    bugLine: 3,
    fixes: ["    while lo > hi:", "    while lo != hi:", "    while lo <= hi:", "    while hi < lo:"], answer: 2,
    explanation: "When lo equals hi there is still one element left to check. lo < hi stops too early, so search([5], 5) returns -1.",
  },
  {
    id: "dbg-py-mutate-while-iterating", lang: "python", difficulty: "hard",
    goal: "Remove every even number from the list.",
    lines: ["nums = [2, 4, 5, 6]", "for n in nums:", "    if n % 2 == 0:", "        nums.remove(n)", "print(nums)"],
    bugLine: 2,
    fixes: ["for n in range(nums):", "for n in nums[:]:", "for n in nums.copy:", "while n in nums:"], answer: 1,
    explanation: "Removing items while looping over the same list shifts the remaining items, so some are skipped and this prints [4, 5]. Looping over a copy, nums[:], fixes it.",
  },

  // ---------- JavaScript ----------
  {
    id: "dbg-js-case", lang: "javascript", difficulty: "easy",
    goal: "Return a greeting for the given name.",
    lines: ["function greet(name) {", '  return "Hello, " + Name;', "}"],
    bugLine: 2,
    fixes: ['  return "Hello, " - name;', '  return "Hello, " + name;', '  return "Hello, " + name();', "  return Hello + name;"], answer: 1,
    explanation: "JavaScript names are case-sensitive. Name is not defined, so this throws a ReferenceError. The parameter is name.",
  },
  {
    id: "dbg-js-off-by-one", lang: "javascript", difficulty: "easy",
    goal: "Return the sum of the numbers in an array.",
    lines: ["function sum(arr) {", "  let total = 0;", "  for (let i = 0; i <= arr.length; i++) {", "    total += arr[i];", "  }", "  return total;", "}"],
    bugLine: 3,
    fixes: ["  for (let i = 1; i <= arr.length; i++) {", "  for (let i = 0; i < arr.length; i++) {", "  for (let i = 0; i <= arr.length - 2; i++) {", "  for (let i = 0; i < arr.length; i--) {"], answer: 1,
    explanation: "The last index is arr.length - 1. With <= the loop reads arr[arr.length], which is undefined, and the total becomes NaN.",
  },
  {
    id: "dbg-js-loose-equality", lang: "javascript", difficulty: "medium",
    goal: "Return true only when v is the number 0.",
    lines: ["function isZero(v) {", "  return v == 0;", "}"],
    bugLine: 2,
    fixes: ["  return v = 0;", "  return !v;", "  return v == null;", "  return v === 0;"], answer: 3,
    explanation: "== converts types before comparing, so isZero(\"\") and isZero(false) return true. === checks the type too.",
  },
  {
    id: "dbg-js-map-return", lang: "javascript", difficulty: "medium",
    goal: "Make a new array with every number doubled.",
    lines: ["const nums = [1, 2, 3];", "const doubled = nums.map((n) => {", "  n * 2;", "});", "console.log(doubled);"],
    bugLine: 3,
    fixes: ["  return n * 2;", "  n *= 2;", "  n * 2", "  nums * 2;"], answer: 0,
    explanation: "An arrow function with curly braces needs an explicit return. Without it every item maps to undefined.",
  },
  {
    id: "dbg-js-missing-await", lang: "javascript", difficulty: "hard",
    goal: "Fetch a user and print their name.",
    lines: ["async function showUser(id) {", "  const res = fetch(`/api/users/${id}`);", "  const user = await res.json();", "  console.log(user.name);", "}"],
    bugLine: 2,
    fixes: ["  const res = fetch(`/api/users/${id}`).name;", "  const res = await fetch(`/api/users/${id}`);", "  await const res = fetch(`/api/users/${id}`);", "  const res = async fetch(`/api/users/${id}`);"], answer: 1,
    explanation: "fetch returns a Promise. Without await, res is the Promise itself, which has no json method, so the next line throws.",
  },
  {
    id: "dbg-js-numeric-sort", lang: "javascript", difficulty: "hard",
    goal: "Sort the scores from smallest to largest.",
    lines: ["const scores = [40, 100, 1, 5];", "scores.sort();", "console.log(scores);"],
    bugLine: 2,
    fixes: ["scores.sort((a, b) => b - a);", "scores.reverse();", "scores.sort((a, b) => a - b);", "scores.sort().reverse();"], answer: 2,
    explanation: "sort() compares items as strings by default, giving [1, 100, 40, 5]. A compare function that returns a - b sorts numbers in ascending order.",
  },

  // ---------- Java ----------
  {
    id: "dbg-java-bounds", lang: "java", difficulty: "easy",
    goal: "Print every element of the array.",
    lines: ["int[] nums = {3, 6, 9};", "for (int i = 0; i <= nums.length; i++) {", "    System.out.println(nums[i]);", "}"],
    bugLine: 2,
    fixes: ["for (int i = 1; i <= nums.length; i++) {", "for (int i = 0; i < nums.length; i++) {", "for (int i = 0; i < nums.length - 1; i++) {", "for (int i = 0; i <= nums.length; i--) {"], answer: 1,
    explanation: "Valid indexes run from 0 to length - 1. With <= the loop reads nums[3] and throws ArrayIndexOutOfBoundsException.",
  },
  {
    id: "dbg-java-semicolon", lang: "java", difficulty: "easy",
    goal: "Store a message and print it.",
    lines: ['String msg = "Hi"', "System.out.println(msg);"],
    bugLine: 1,
    fixes: ["String msg = 'Hi';", 'string msg = "Hi";', 'String msg = "Hi";', 'String msg == "Hi";'], answer: 2,
    explanation: "Every Java statement ends with a semicolon. Single quotes are only for single characters, and the type is String with a capital S.",
  },
  {
    id: "dbg-java-string-compare", lang: "java", difficulty: "medium",
    goal: "Print \"Same\" when the user types the same text twice.",
    lines: ["String a = scanner.nextLine();", "String b = scanner.nextLine();", "if (a == b) {", '    System.out.println("Same");', "}"],
    bugLine: 3,
    fixes: ["if (a = b) {", "if (a.equals(b)) {", "if (a.length == b.length) {", "if (a === b) {"], answer: 1,
    explanation: "== compares object references, and two lines read from input are separate objects. equals compares the characters.",
  },
  {
    id: "dbg-java-int-division", lang: "java", difficulty: "medium",
    goal: "Print the average of 3 and 4 as a decimal (3.5).",
    lines: ["int a = 3, b = 4;", "double avg = (a + b) / 2;", "System.out.println(avg);"],
    bugLine: 2,
    fixes: ["double avg = (double) ((a + b) / 2);", "int avg = (a + b) / 2;", "double avg = (a + b) / 2.0;", "double avg = a + b / 2;"], answer: 2,
    explanation: "(a + b) / 2 divides two ints, giving 3, before it is stored as 3.0. Dividing by 2.0 makes it a decimal division. Casting after the division is too late.",
  },
  {
    id: "dbg-java-continue", lang: "java", difficulty: "hard",
    goal: "Print the odd numbers below 10.",
    lines: ["int i = 0;", "while (i < 10) {", "    if (i % 2 == 0) continue;", "    System.out.println(i);", "    i++;", "}"],
    bugLine: 3,
    fixes: ["    if (i % 2 == 0) break;", "    if (i % 2 == 0) { i++; continue; }", "    if (i % 2 != 0) continue;", "    if (i % 2 == 0) return;"], answer: 1,
    explanation: "continue jumps back to the loop check and skips i++, so i stays 0 forever. The counter must still move on before continuing.",
  },
  {
    id: "dbg-java-overflow", lang: "java", difficulty: "hard",
    goal: "Multiply two large numbers correctly.",
    lines: ["int a = 100000;", "int b = 100000;", "long product = a * b;", "System.out.println(product);"],
    bugLine: 3,
    fixes: ["long product = (long) (a * b);", "int product = a * b;", "long product = a * b * 1L;", "long product = (long) a * b;"], answer: 3,
    explanation: "a * b is worked out as an int and overflows before it is stored in the long. Casting a to long first makes the multiplication itself use long.",
  },

  // ---------- C++ ----------
  {
    id: "dbg-cpp-stray-semicolon", lang: "cpp", difficulty: "easy",
    goal: "Print the numbers 0 to 4.",
    lines: ["for (int i = 0; i < 5; i++);", "{", '    cout << i << " ";', "}"],
    bugLine: 1,
    fixes: ["for (int i = 0; i <= 5; i++);", "for (int i = 0; i < 5; i++)", "for (int i = 1; i < 5; i++)", "for (i = 0; i < 5; i++);"], answer: 1,
    explanation: "The semicolon ends the loop with an empty body. The block below then runs once, outside the loop, where i does not exist.",
  },
  {
    id: "dbg-cpp-assign-in-if", lang: "cpp", difficulty: "easy",
    goal: "Print \"ten\" only when x is 10.",
    lines: ["int x = 4;", "if (x = 10) {", '    cout << "ten";', "}"],
    bugLine: 2,
    fixes: ["if (x := 10) {", "if (x === 10) {", "if (x == 10) {", "if (10 = x) {"], answer: 2,
    explanation: "x = 10 assigns 10 to x and the condition is then always true. Comparison uses ==.",
  },
  {
    id: "dbg-cpp-swap-by-value", lang: "cpp", difficulty: "medium",
    goal: "Swap the values of two variables.",
    lines: ["void swapNums(int a, int b) {", "    int t = a;", "    a = b;", "    b = t;", "}"],
    bugLine: 1,
    fixes: ["void swapNums(int a, int b) const {", "int swapNums(int a, int b) {", "void swapNums(int &a, int &b) {", "void swapNums(int *a, int b) {"], answer: 2,
    explanation: "Parameters passed by value are copies, so the swap never reaches the caller. References make a and b refer to the caller's variables.",
  },
  {
    id: "dbg-cpp-integer-average", lang: "cpp", difficulty: "medium",
    goal: "Print the average of the vector (2.5).",
    lines: ["vector<int> v = {2, 3};", "double avg = (v[0] + v[1]) / v.size();", "cout << avg;"],
    bugLine: 2,
    fixes: ["double avg = (double) ((v[0] + v[1]) / v.size());", "int avg = (v[0] + v[1]) / v.size();", "double avg = v[0] + v[1] / v.size();", "double avg = (v[0] + v[1]) / (double) v.size();"], answer: 3,
    explanation: "Both sides of / are integers, so 5 / 2 gives 2. Converting one side to double before dividing keeps the .5.",
  },
  {
    id: "dbg-cpp-dangling", lang: "cpp", difficulty: "hard",
    goal: "Return a greeting the caller can print.",
    lines: ["const char* greet() {", '    char msg[] = "hello";', "    return msg;", "}"],
    bugLine: 2,
    fixes: ['    char msg[6] = "hello";', '    static char msg[] = "hello";', '    const char msg[] = "hello";', "    char* msg = new char[2];"], answer: 1,
    explanation: "msg is a local array that is destroyed when greet returns, so the caller gets a dangling pointer. static storage lasts for the whole program. Returning std::string is another fix.",
  },
  {
    id: "dbg-cpp-unsigned-loop", lang: "cpp", difficulty: "hard",
    goal: "Print the vector backwards.",
    lines: ["vector<int> v = {1, 2, 3};", "for (unsigned i = v.size() - 1; i >= 0; i--) {", "    cout << v[i];", "}"],
    bugLine: 2,
    fixes: ["for (unsigned i = v.size(); i >= 0; i--) {", "for (unsigned i = v.size() - 1; i > 0; i--) {", "for (int i = v.size() - 1; i >= 0; i--) {", "for (int i = v.size(); i >= 0; i--) {"], answer: 2,
    explanation: "An unsigned number is never below 0, so i >= 0 is always true. After 0, i wraps to a huge value and reads far outside the vector. A signed int lets the loop end.",
  },
];
