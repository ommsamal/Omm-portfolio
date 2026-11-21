// Guess the Output question bank.
// To add a question, append an object to OUTPUT_QUESTIONS with a new unique id.
// `answer` is the index (0-3) of the correct option. Java and C++ snippets with
// `inMain: true` are the body of main(); the UI says so under the code.
import type { Lang } from "./highlight";

export type Difficulty = "easy" | "medium" | "hard";

export type OutputQuestion = {
  id: string;
  lang: Lang;
  difficulty: Difficulty;
  code: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
  inMain?: boolean;
};

export const OUTPUT_QUESTIONS: OutputQuestion[] = [
  // ---------- Python ----------
  {
    id: "py-reverse-slice", lang: "python", difficulty: "easy",
    code: "x = [1, 2, 3]\nprint(x[::-1])",
    options: ["[1, 2, 3]", "[3, 2, 1]", "Error", "None"], answer: 1,
    explanation: "A slice with step -1 walks the list backwards, giving a reversed copy.",
  },
  {
    id: "py-floor-mod", lang: "python", difficulty: "easy",
    code: "print(7 // 2, 7 % 2)",
    options: ["3.5 1", "3 1", "3 0.5", "4 1"], answer: 1,
    explanation: "// is floor division (7 // 2 is 3) and % is the remainder (1). print separates the two values with a space.",
  },
  {
    id: "py-string-repeat", lang: "python", difficulty: "easy",
    code: 's = "code"\nprint(s * 2)',
    options: ["code code", "codecode", "Error", "code2"], answer: 1,
    explanation: "Multiplying a string by an integer repeats it with nothing in between.",
  },
  {
    id: "py-default-list", lang: "python", difficulty: "medium",
    code: "def f(a, b=[]):\n    b.append(a)\n    return b\n\nf(1)\nprint(f(2))",
    options: ["[2]", "[1, 2]", "[]", "Error"], answer: 1,
    explanation: "Default values are created once, when the function is defined. Both calls share the same list, so it keeps the 1 from the first call.",
  },
  {
    id: "py-float-equality", lang: "python", difficulty: "medium",
    code: "print(0.1 + 0.2 == 0.3)",
    options: ["True", "False", "Error", "0.3"], answer: 1,
    explanation: "0.1 and 0.2 cannot be stored exactly in binary floating point. Their sum is 0.30000000000000004, which is not equal to 0.3.",
  },
  {
    id: "py-alias", lang: "python", difficulty: "medium",
    code: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))",
    options: ["3", "4", "Error", "None"], answer: 1,
    explanation: "b = a does not copy the list. Both names point to the same list, so appending through b changes a too.",
  },
  {
    id: "py-comprehension-filter", lang: "python", difficulty: "hard",
    code: "print([i * i for i in range(5) if i % 2])",
    options: ["[0, 4, 16]", "[1, 9]", "[1, 4, 9]", "[0, 1, 4, 9, 16]"], answer: 1,
    explanation: "i % 2 is truthy only for odd numbers, so only 1 and 3 pass the filter. Their squares are 1 and 9.",
  },
  {
    id: "py-unbound-local", lang: "python", difficulty: "hard",
    code: "x = 10\n\ndef g():\n    x += 1\n    return x\n\nprint(g())",
    options: ["11", "10", "Error", "None"], answer: 2,
    explanation: "Assigning to x inside g makes x local to g. x += 1 reads it before it has a value, raising UnboundLocalError. Use `global x` to change the outer variable.",
  },
  {
    id: "py-sorted-reverse", lang: "python", difficulty: "hard",
    code: 'print(sorted("banana", reverse=True)[:3])',
    options: ["['n', 'n', 'b']", "['b', 'a', 'n']", "['a', 'a', 'a']", "nnb"], answer: 0,
    explanation: "sorted() on a string returns a list of its characters. Sorted in reverse they are n, n, b, a, a, a, and [:3] keeps the first three.",
  },

  // ---------- JavaScript ----------
  {
    id: "js-plus-string", lang: "javascript", difficulty: "easy",
    code: 'console.log("5" + 3);',
    options: ["8", "53", "NaN", "Error"], answer: 1,
    explanation: "When either side of + is a string, JavaScript converts the other side to a string and joins them.",
  },
  {
    id: "js-minus-string", lang: "javascript", difficulty: "easy",
    code: 'console.log("5" - 3);',
    options: ["2", "53", "NaN", "Error"], answer: 0,
    explanation: "- only works on numbers, so the string \"5\" is converted to the number 5 first.",
  },
  {
    id: "js-typeof-null", lang: "javascript", difficulty: "easy",
    code: "console.log(typeof null);",
    options: ["null", "object", "undefined", "Error"], answer: 1,
    explanation: "typeof null is \"object\". It is a long-standing quirk kept for backwards compatibility.",
  },
  {
    id: "js-map-join", lang: "javascript", difficulty: "medium",
    code: 'console.log([1, 2, 3].map((n) => n * 2).join("-"));',
    options: ["2-4-6", "1-2-3", "[2, 4, 6]", "246"], answer: 0,
    explanation: "map doubles each number into a new array, then join puts \"-\" between the items.",
  },
  {
    id: "js-float-equality", lang: "javascript", difficulty: "medium",
    code: "console.log(0.1 + 0.2 === 0.3);",
    options: ["true", "false", "NaN", "0.3"], answer: 1,
    explanation: "JavaScript numbers are binary floating point, so 0.1 + 0.2 is 0.30000000000000004.",
  },
  {
    id: "js-default-sort", lang: "javascript", difficulty: "medium",
    code: 'const a = [10, 1, 3];\na.sort();\nconsole.log(a.join(","));',
    options: ["1,3,10", "1,10,3", "10,3,1", "3,1,10"], answer: 1,
    explanation: "Without a compare function, sort compares items as strings. \"10\" comes before \"3\" because \"1\" sorts before \"3\".",
  },
  {
    id: "js-var-timeout", lang: "javascript", difficulty: "hard",
    code: "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}",
    options: ["0 1 2", "3 3 3", "0 0 0", "undefined undefined undefined"], answer: 1,
    explanation: "var is function-scoped, so all three callbacks share one i. They run after the loop ends, when i is 3. With let, each iteration gets its own i and you would see 0 1 2.",
  },
  {
    id: "js-array-plus-object", lang: "javascript", difficulty: "hard",
    code: "console.log([] + {});",
    options: ['""', "[object Object]", "{}", "Error"], answer: 1,
    explanation: "+ converts both sides to strings: [] becomes an empty string and {} becomes \"[object Object]\".",
  },
  {
    id: "js-nan", lang: "javascript", difficulty: "hard",
    code: "console.log(NaN === NaN, Object.is(NaN, NaN));",
    options: ["true true", "false false", "false true", "true false"], answer: 2,
    explanation: "NaN is the only value not equal to itself with ===. Object.is uses same-value comparison, which treats NaN as equal to NaN.",
  },

  // ---------- Java ----------
  {
    id: "java-int-division", lang: "java", difficulty: "easy", inMain: true,
    code: "int a = 7, b = 2;\nSystem.out.println(a / b);",
    options: ["3.5", "3", "4", "Error"], answer: 1,
    explanation: "Dividing two ints gives an int. The fractional part is dropped, not rounded.",
  },
  {
    id: "java-length", lang: "java", difficulty: "easy", inMain: true,
    code: 'String s = "Java";\nSystem.out.println(s.length());',
    options: ["3", "4", "5", "Error"], answer: 1,
    explanation: "length() returns the number of characters: J, a, v, a.",
  },
  {
    id: "java-concat-order", lang: "java", difficulty: "easy", inMain: true,
    code: 'System.out.println(1 + 2 + "3");',
    options: ["6", "123", "33", "Error"], answer: 2,
    explanation: "+ runs left to right. 1 + 2 is the number 3, then 3 + \"3\" joins as text to give \"33\".",
  },
  {
    id: "java-concat-string-first", lang: "java", difficulty: "medium", inMain: true,
    code: 'System.out.println("3" + 1 + 2);',
    options: ["6", "312", "33", "Error"], answer: 1,
    explanation: "The string comes first, so \"3\" + 1 is \"31\", and \"31\" + 2 is \"312\".",
  },
  {
    id: "java-enhanced-for", lang: "java", difficulty: "medium", inMain: true,
    code: "int[] arr = {1, 2, 3};\nint sum = 0;\nfor (int n : arr) sum += n;\nSystem.out.println(sum * 2);",
    options: ["6", "12", "123123", "Error"], answer: 1,
    explanation: "The loop adds 1 + 2 + 3 = 6, then the result is doubled to 12.",
  },
  {
    id: "java-string-equality", lang: "java", difficulty: "medium", inMain: true,
    code: 'String a = new String("hi");\nString b = new String("hi");\nSystem.out.println((a == b) + " " + a.equals(b));',
    options: ["true true", "false true", "true false", "false false"], answer: 1,
    explanation: "== checks whether two references point to the same object. new String creates two objects, so == is false, while equals compares the text and is true.",
  },
  {
    id: "java-increment", lang: "java", difficulty: "hard", inMain: true,
    code: "int x = 5;\nint y = x++ + ++x;\nSystem.out.println(y);",
    options: ["11", "12", "10", "13"], answer: 1,
    explanation: "x++ gives 5 and then makes x 6. ++x makes x 7 and gives 7. 5 + 7 = 12. Java evaluates left to right, so this is well defined.",
  },
  {
    id: "java-integer-cache", lang: "java", difficulty: "hard", inMain: true,
    code: "Integer a = 127, b = 127;\nInteger c = 128, d = 128;\nSystem.out.println((a == b) + \" \" + (c == d));",
    options: ["true true", "false false", "true false", "false true"], answer: 2,
    explanation: "Java caches Integer objects from -128 to 127, so a and b are the same object. 128 is outside the cache, so c and d are different objects and == is false.",
  },
  {
    id: "java-char-compound", lang: "java", difficulty: "hard", inMain: true,
    code: "char c = 'A';\nc += 1;\nSystem.out.println(c);",
    options: ["66", "B", "A1", "Error"], answer: 1,
    explanation: "Compound assignment includes an automatic cast back to char, so 'A' + 1 becomes 'B'. Writing c = c + 1 would not compile.",
  },

  // ---------- C++ ----------
  {
    id: "cpp-div-mod", lang: "cpp", difficulty: "easy", inMain: true,
    code: 'int a = 10;\ncout << a / 3 << " " << a % 3;',
    options: ["3.33 1", "3 1", "3 0", "4 1"], answer: 1,
    explanation: "Integer division drops the remainder (10 / 3 is 3) and % gives the remainder (1).",
  },
  {
    id: "cpp-precedence", lang: "cpp", difficulty: "easy", inMain: true,
    code: "int x = 5;\nx += 3 * 2;\ncout << x;",
    options: ["16", "11", "10", "8"], answer: 1,
    explanation: "3 * 2 is worked out first, then added to x: 5 + 6 = 11.",
  },
  {
    id: "cpp-string-size", lang: "cpp", difficulty: "easy", inMain: true,
    code: 'string s = "hello";\ncout << s.size();',
    options: ["4", "5", "6", "Error"], answer: 1,
    explanation: "size() counts the characters in the string. std::string does not count a closing null character.",
  },
  {
    id: "cpp-sizeof-array", lang: "cpp", difficulty: "medium", inMain: true,
    code: "int arr[] = {4, 8, 15};\ncout << sizeof(arr) / sizeof(arr[0]);",
    options: ["3", "12", "4", "27"], answer: 0,
    explanation: "sizeof(arr) is the size of the whole array in bytes and sizeof(arr[0]) is one element, so the division gives the element count.",
  },
  {
    id: "cpp-while-step", lang: "cpp", difficulty: "medium", inMain: true,
    code: "int i = 0;\nwhile (i < 5) i += 2;\ncout << i;",
    options: ["4", "5", "6", "Infinite loop"], answer: 2,
    explanation: "i goes 0, 2, 4, 6. The check i < 5 fails at 6, so the loop stops there.",
  },
  {
    id: "cpp-reference", lang: "cpp", difficulty: "medium", inMain: true,
    code: "int a = 5;\nint &r = a;\nr = 9;\ncout << a;",
    options: ["5", "9", "14", "Error"], answer: 1,
    explanation: "r is a reference, another name for a. Assigning to r assigns to a.",
  },
  {
    id: "cpp-bitwise", lang: "cpp", difficulty: "hard", inMain: true,
    code: 'int x = 7;\ncout << (x & 3) << " " << (x >> 1);',
    options: ["3 3", "7 3", "3 14", "1 3"], answer: 0,
    explanation: "7 is 111 in binary. 111 & 011 is 011 (3), and shifting 111 right by one gives 11 (3).",
  },
  {
    id: "cpp-unsigned-wrap", lang: "cpp", difficulty: "hard", inMain: true,
    code: "unsigned int u = 0;\nu = u - 1;\ncout << (u > 0);",
    options: ["0", "1", "-1", "Error"], answer: 1,
    explanation: "Unsigned numbers wrap around: 0 - 1 becomes the largest unsigned value, which is greater than 0. cout prints true as 1.",
  },
  {
    id: "cpp-lambda-by-value", lang: "cpp", difficulty: "hard", inMain: true,
    code: "auto inc = [](int n) { n++; };\nint v = 1;\ninc(v);\ncout << v;",
    options: ["1", "2", "0", "Error"], answer: 0,
    explanation: "The lambda takes n by value, so it increments its own copy. Taking int &n would change v.",
  },
];
