
const CHALLENGES = [
    {
        id: 'playground',
        title: 'Free Playground',
        description: 'Write any code you want to test.',
        type: 'playground',
        starterCode: {
            javascript: '// Write your JavaScript code here\nconsole.log("Hello, Code Arena!");',
            python: '# Write your Python code here\nprint("Hello, Code Arena!")',
            java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Code Arena!");\n    }\n}',
            cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, Code Arena!" << std::endl;\n    return 0;\n}',
            c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, Code Arena!\\n");\n    return 0;\n}'
        }
    },
    {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table'],
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        fnName: { javascript: 'twoSum', python: 'two_sum', java: 'twoSum', cpp: 'twoSum', c: 'twoSum' },
        testCases: [
            { input: '([2,7,11,15], 9)', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
            { input: '([3,2,4], 6)', args: [[3, 2, 4], 6], expected: [1, 2] },
            { input: '([3,3], 6)', args: [[3, 3], 6], expected: [0, 1] }
        ],
        hints: [
            "Try using a hash map to store the values and their indices.",
            "For each number, check if (target - num) exists in the map."
        ],
        starterCode: {
            javascript: 'function twoSum(nums, target) {\n  // Your code here\n  \n}',
            python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}',
            cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n        return {};\n    }\n};',
            c: '/** Note: The returned array must be malloced, assume caller calls free(). */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Your code here\n    *returnSize = 2;\n    return 0;\n}'
        }
    },
    {
        id: 'palindrome-number',
        title: 'Palindrome Number',
        difficulty: 'Easy',
        tags: ['Math'],
        description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
        fnName: { javascript: 'isPalindrome', python: 'is_palindrome', java: 'isPalindrome', cpp: 'isPalindrome', c: 'isPalindrome' },
        testCases: [
            { input: '(121)', args: [121], expected: true },
            { input: '(-121)', args: [-121], expected: false },
            { input: '(10)', args: [10], expected: false }
        ],
        hints: [
            "Negative numbers are never palindromes.",
            "Try reversing the number mathematically and comparing it with the original."
        ],
        starterCode: {
            javascript: 'function isPalindrome(x) {\n  // Your code here\n}',
            python: 'def is_palindrome(x):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean isPalindrome(int x) {\n        // Your code here\n        return false;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    bool isPalindrome(int x) {\n        // Your code here\n        return false;\n    }\n};',
            c: 'bool isPalindrome(int x){\n    // Your code here\n    return false;\n}'
        }
    },
    {
        id: 'fizz-buzz',
        title: 'Fizz Buzz',
        difficulty: 'Easy',
        tags: ['Math', 'String'],
        description: 'Given an integer n, return a string array answer where answer[i] == "FizzBuzz" if i is divisible by 3 and 5, "Fizz" if by 3, "Buzz" if by 5, else i.',
        fnName: { javascript: 'fizzBuzz', python: 'fizz_buzz', java: 'fizzBuzz', cpp: 'fizzBuzz', c: 'fizzBuzz' },
        testCases: [
            { input: '(3)', args: [3], expected: ["1", "2", "Fizz"] },
            { input: '(5)', args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] }
        ],
        hints: [
            "Use the modulo operator (%) to check for divisibility.",
            "Check for divisibility by 15 (both 3 and 5) first."
        ],
        starterCode: {
            javascript: 'function fizzBuzz(n) {\n  // Your code here\n}',
            python: 'def fizz_buzz(n):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<String> fizzBuzz(int n) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}',
            cpp: 'class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        // Your code here\n        return {};\n    }\n};',
            c: '/** Note: Return array must be malloced. */\nchar** fizzBuzz(int n, int* returnSize) {\n    // Your code here\n    *returnSize = n;\n    return 0;\n}'
        }
    },
    {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'Medium',
        tags: ['Stack', 'String'],
        description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
        fnName: { javascript: 'isValid', python: 'is_valid', java: 'isValid', cpp: 'isValid', c: 'isValid' },
        testCases: [
            { input: '("()")', args: ["()"], expected: true },
            { input: '("()[]{}")', args: ["()[]{}"], expected: true },
            { input: '("(]")', args: ["(]"], expected: false }
        ],
        hints: [
            "Use a stack to track open brackets.",
            "When you see a closing bracket, check if it matches the top of the stack."
        ],
        starterCode: {
            javascript: 'function isValid(s) {\n  // Your code here\n}',
            python: 'def is_valid(s):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n        return false;\n    }\n};',
            c: 'bool isValid(char * s){\n    // Your code here\n    return false;\n}'
        }
    },
    {
        id: 'plus-one',
        title: 'Plus One',
        difficulty: 'Easy',
        tags: ['Array', 'Math'],
        description: 'Increment the large integer represented as an integer array digits by one.',
        fnName: { javascript: 'plusOne', python: 'plus_one', java: 'plusOne', cpp: 'plusOne', c: 'plusOne' },
        testCases: [
            { input: '([1,2,3])', args: [[1, 2, 3]], expected: [1, 2, 4] },
            { input: '([9])', args: [[9]], expected: [1, 0] }
        ],
        hints: [
            "Iterate from the end of the array.",
            "If a digit is 9, it becomes 0 and you carry over to the next digit.",
            "Don't forget the case where all digits are 9 (e.g., [9,9] becomes [1,0,0])."
        ],
        starterCode: {
            javascript: 'function plusOne(digits) {\n  // Your code here\n}',
            python: 'def plus_one(digits):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int[] plusOne(int[] digits) {\n        // Your code here\n        return new int[]{};\n    }\n}',
            cpp: 'class Solution {\npublic:\n    vector<int> plusOne(vector<int>& digits) {\n        // Your code here\n        return {};\n    }\n};',
            c: '/** Note: Return array must be malloced. */\nint* plusOne(int* digits, int digitsSize, int* returnSize) {\n    // Your code here\n    return 0;\n}'
        }
    },
    {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        tags: ['Math', 'Dynamic Programming'],
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. How many distinct ways can you climb to the top?',
        fnName: { javascript: 'climbStairs', python: 'climb_stairs', java: 'climbStairs', cpp: 'climbStairs', c: 'climbStairs' },
        testCases: [
            { input: '(2)', args: [2], expected: 2 },
            { input: '(3)', args: [3], expected: 3 }
        ],
        hints: [
            "This is a classic Dynamic Programming problem.",
            "The number of ways to reach step n is the sum of ways to reach n-1 and n-2."
        ],
        starterCode: {
            javascript: 'function climbStairs(n) {\n  // Your code here\n}',
            python: 'def climb_stairs(n):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int climbStairs(int n) {\n        // Your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        // Your code here\n        return 0;\n    }\n};',
            c: 'int climbStairs(int n){\n    // Your code here\n    return 0;\n}'
        }
    },
    {
        id: 'missing-number',
        title: 'Missing Number',
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table', 'Bit Manipulation'],
        description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
        fnName: { javascript: 'missingNumber', python: 'missing_number', java: 'missingNumber', cpp: 'missingNumber', c: 'missingNumber' },
        testCases: [
            { input: '([3,0,1])', args: [[3, 0, 1]], expected: 2 },
            { input: '([0,1])', args: [[0, 1]], expected: 2 }
        ],
        hints: [
            "You can use the formula for the sum of the first n integers: n*(n+1)/2.",
            "Subtract the sum of the array from the expected sum to find the missing number."
        ],
        starterCode: {
            javascript: 'function missingNumber(nums) {\n  // Your code here\n}',
            python: 'def missing_number(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int missingNumber(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        // Your code here\n        return 0;\n    }\n};',
            c: 'int missingNumber(int* nums, int numsSize){\n    // Your code here\n    return 0;\n}'
        }
    },
    {
        id: 'single-number',
        title: 'Single Number',
        difficulty: 'Easy',
        tags: ['Array', 'Bit Manipulation'],
        description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.',
        fnName: { javascript: 'singleNumber', python: 'single_number', java: 'singleNumber', cpp: 'singleNumber', c: 'singleNumber' },
        testCases: [
            { input: '([2,2,1])', args: [[2, 2, 1]], expected: 1 },
            { input: '([4,1,2,1,2])', args: [[4, 1, 2, 1, 2]], expected: 4 }
        ],
        hints: [
            "Bit manipulation is very efficient here.",
            "The XOR operator (^) returns 0 if two bits are the same, and 1 if they are different."
        ],
        starterCode: {
            javascript: 'function singleNumber(nums) {\n  // Your code here\n}',
            python: 'def single_number(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int singleNumber(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Your code here\n        return 0;\n    }\n};',
            c: 'int singleNumber(int* nums, int numsSize){\n    // Your code here\n    return 0;\n}'
        }
    },
    {
        id: 'fibonacci-number',
        title: 'Fibonacci Number',
        difficulty: 'Easy',
        tags: ['Math', 'Recursion'],
        description: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.',
        fnName: { javascript: 'fib', python: 'fib', java: 'fib', cpp: 'fib', c: 'fib' },
        testCases: [
            { input: '(2)', args: [2], expected: 1 },
            { input: '(4)', args: [4], expected: 3 }
        ],
        hints: [
            "F(n) = F(n-1) + F(n-2) for n > 1.",
            "Use recursion with memoization or a simple loop to avoid redundant calculations."
        ],
        starterCode: {
            javascript: 'function fib(n) {\n  // Your code here\n}',
            python: 'def fib(n):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int fib(int n) {\n        // Your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int fib(int n) {\n        // Your code here\n        return 0;\n    }\n};',
            c: 'int fib(int n){\n    // Your code here\n    return 0;\n}'
        }
    },
    {
        id: 'power-of-two',
        title: 'Power of Two',
        difficulty: 'Easy',
        tags: ['Math', 'Bit Manipulation'],
        description: 'Given an integer n, return true if it is a power of two. Otherwise, return false.',
        fnName: { javascript: 'isPowerOfTwo', python: 'is_power_of_two', java: 'isPowerOfTwo', cpp: 'isPowerOfTwo', c: 'isPowerOfTwo' },
        testCases: [
            { input: '(1)', args: [1], expected: true },
            { input: '(16)', args: [16], expected: true },
            { input: '(3)', args: [3], expected: false }
        ],
        hints: [
            "A power of two has exactly one bit set in binary.",
            "Check if (n > 0) and (n & (n - 1)) is 0."
        ],
        starterCode: {
            javascript: 'function isPowerOfTwo(n) {\n  // Your code here\n}',
            python: 'def is_power_of_two(n):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean isPowerOfTwo(int n) {\n        // Your code here\n        return false;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    bool isPowerOfTwo(int n) {\n        // Your code here\n        return false;\n    }\n};',
            c: 'bool isPowerOfTwo(int n){\n    // Your code here\n    return false;\n}'
        }
    },
    {
        id: 'valid-anagram',
        title: 'Valid Anagram',
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table'],
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
        fnName: { javascript: 'isAnagram', python: 'is_anagram', java: 'isAnagram', cpp: 'isAnagram', c: 'isAnagram' },
        testCases: [
            { input: '("anagram", "nagaram")', args: ["anagram", "nagaram"], expected: true },
            { input: '("rat", "car")', args: ["rat", "car"], expected: false }
        ],
        hints: [
            "Two strings are anagrams if they have the same characters with the same frequencies.",
            "Use a frequency map (hash map) or sort both strings and compare."
        ],
        starterCode: {
            javascript: 'function isAnagram(s, t) {\n  // Your code here\n}',
            python: 'def is_anagram(s, t):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Your code here\n        return false;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Your code here\n        return false;\n    }\n};',
            c: 'bool isAnagram(char * s, char * t){\n    // Your code here\n    return false;\n}'
        }
    },
    {
        id: 'move-zeroes',
        title: 'Move Zeroes',
        difficulty: 'Easy',
        tags: ['Array', 'Two Pointers'],
        description: 'Given an integer array nums, move all 0s to the end of it while maintaining the relative order of the non-zero elements. Return modified array.',
        fnName: { javascript: 'moveZeroes', python: 'move_zeroes', java: 'moveZeroes', cpp: 'moveZeroes', c: 'moveZeroes' },
        testCases: [
            { input: '([0,1,0,3,12])', args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
            { input: '([0])', args: [[0]], expected: [0] }
        ],
        hints: [
            "Use two pointers: one to track the position of the last non-zero element.",
            "Iterate through the array and move non-zero elements forward."
        ],
        starterCode: {
            javascript: 'function moveZeroes(nums) {\n  // Your code here\n  return nums;\n}',
            python: 'def move_zeroes(nums):\n    # Your code here\n    return nums',
            java: 'class Solution {\n    public int[] moveZeroes(int[] nums) {\n        // Your code here\n        return nums;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    vector<int> moveZeroes(vector<int>& nums) {\n        // Your code here\n        return nums;\n    }\n};',
            c: 'void moveZeroes(int* nums, int numsSize){\n    // Your code here\n}'
        }
    },
    {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table', 'Sorting'],
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        fnName: { javascript: 'containsDuplicate', python: 'contains_duplicate', java: 'containsDuplicate', cpp: 'containsDuplicate', c: 'containsDuplicate' },
        testCases: [
            { input: '([1,2,3,1])', args: [[1, 2, 3, 1]], expected: true },
            { input: '([1,2,3,4])', args: [[1, 2, 3, 4]], expected: false }
        ],
        hints: [
            "Use a Set to keep track of seen elements.",
            "If an element is already in the Set, return true."
        ],
        starterCode: {
            javascript: 'function containsDuplicate(nums) {\n  // Your code here\n}',
            python: 'def contains_duplicate(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Your code here\n        return false;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // Your code here\n        return false;\n    }\n};',
            c: 'bool containsDuplicate(int* nums, int numsSize){\n    // Your code here\n    return false;\n}'
        }
    },
    {
        id: 'binary-search',
        title: 'Binary Search',
        difficulty: 'Easy',
        tags: ['Array', 'Binary Search'],
        description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
        fnName: { javascript: 'search', python: 'search', java: 'search', cpp: 'search', c: 'search' },
        testCases: [
            { input: '([-1,0,3,5,9,12], 9)', args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
            { input: '([-1,0,3,5,9,12], 2)', args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 }
        ],
        hints: [
            "Divide the search range in half in each step.",
            "Compare the target with the middle element to decide which half to search next."
        ],
        starterCode: {
            javascript: 'function search(nums, target) {\n  // Your code here\n}',
            python: 'def search(nums, target):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Your code here\n        return -1;\n    }\n};',
            c: 'int search(int* nums, int numsSize, int target){\n    // Your code here\n    return -1;\n}'
        }
    },
    {
        id: 'reverse-string',
        title: 'Reverse String',
        difficulty: 'Easy',
        tags: ['Two Pointers', 'String'],
        description: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.',
        fnName: { javascript: 'reverseString', python: 'reverse_string', java: 'reverseString', cpp: 'reverseString', c: 'reverseString' },
        testCases: [
            { input: '(["h","e","l","l","o"])', args: [["h", "e", "l", "l", "o"]], expected: ["o", "l", "l", "e", "h"] }
        ],
        hints: [
            "Use two pointers, one at the start and one at the end.",
            "Swap the characters at the pointers and move them towards each other."
        ],
        starterCode: {
            javascript: 'function reverseString(s) {\n  // Your code here\n  return s.reverse();\n}',
            python: 'def reverse_string(s):\n    # Your code here\n    return s[::-1]',
            java: 'class Solution {\n    public char[] reverseString(char[] s) {\n        // Your code here\n        return s;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Your code here\n    }\n};',
            c: 'void reverseString(char* s, int sSize){\n    // Your code here\n}'
        }
    },
    {
        id: 'palindrome',
        title: 'Valid Palindrome String',
        difficulty: 'Easy',
        tags: ['Two Pointers', 'String'],
        description: 'Check if the string is a palindrome (ignoring non-alphanumeric).',
        fnName: { javascript: 'isPalindrome', python: 'is_palindrome', java: 'isPalindrome', cpp: 'isPalindrome', c: 'isPalindrome' },
        testCases: [
            { input: '("aba")', args: ["aba"], expected: true },
            { input: '("race a car")', args: ["race a car"], expected: false },
        ],
        hints: [
            "Clean the string first by removing non-alphanumeric characters and converting to lowercase.",
            "Check if the cleaned string is equal to its reverse."
        ],
        starterCode: {
            javascript: 'function isPalindrome(s) {\n  // Your logic here\n  return false;\n}',
            python: 'def is_palindrome(s):\n    # Your logic here\n    return False',
            java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        // Your logic here\n        return false;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Your logic here\n        return false;\n    }\n};',
            c: 'bool isPalindrome(char * s){\n    // Your logic here\n    return false;\n}'
        }
    },
    {
        id: 'length-of-last-word',
        title: 'Length of Last Word',
        difficulty: 'Easy',
        tags: ['String'],
        description: 'Given a string s consisting of words and spaces, return the length of the last word in the string.',
        fnName: { javascript: 'lengthOfLastWord', python: 'length_of_last_word', java: 'lengthOfLastWord', cpp: 'lengthOfLastWord', c: 'lengthOfLastWord' },
        testCases: [
            { input: '("Hello World")', args: ["Hello World"], expected: 5 },
            { input: '("   fly me   to   the moon  ")', args: ["   fly me   to   the moon  "], expected: 4 }
        ],
        hints: [
            "Trim trailing spaces first.",
            "Find the position of the last space to determine the last word's length."
        ],
        starterCode: {
            javascript: 'function lengthOfLastWord(s) {\n  // Your code here\n}',
            python: 'def length_of_last_word(s):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int lengthOfLastWord(String s) {\n        // Your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int lengthOfLastWord(string s) {\n        // Your code here\n        return 0;\n    }\n};',
            c: 'int lengthOfLastWord(char * s){\n    // Your code here\n    return 0;\n}'
        }
    },
    {
        id: 'reverse-words',
        title: 'Reverse Words in a String',
        difficulty: 'Medium',
        tags: ['Two Pointers', 'String'],
        description: 'Given an input string s, reverse the order of the words.',
        fnName: { javascript: 'reverseWords', python: 'reverse_words', java: 'reverseWords', cpp: 'reverseWords', c: 'reverseWords' },
        testCases: [
            { input: '("the sky is blue")', args: ["the sky is blue"], expected: "blue is sky the" },
            { input: '("  hello world  ")', args: ["  hello world  "], expected: "world hello" }
        ],
        hints: [
            "Split the string into words using spaces.",
            "Reverse the array of words and join them back with a single space."
        ],
        starterCode: {
            javascript: 'function reverseWords(s) {\n  // Your code here\n}',
            python: 'def reverse_words(s):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public String reverseWords(String s) {\n        // Your code here\n        return "";\n    }\n}',
            cpp: 'class Solution {\npublic:\n    string reverseWords(string s) {\n        // Your code here\n        return "";\n    }\n};',
            c: 'char * reverseWords(char * s){\n    // Your code here\n    return "";\n}'
        }
    },
    {
        id: 'median-of-two-sorted-arrays',
        title: 'Median of Two Sorted Arrays',
        difficulty: 'Hard',
        tags: ['Array', 'Binary Search', 'Divide and Conquer'],
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
        fnName: { javascript: 'findMedianSortedArrays', python: 'find_median_sorted_arrays', java: 'findMedianSortedArrays', cpp: 'findMedianSortedArrays', c: 'findMedianSortedArrays' },
        testCases: [
            { input: '([1,2], [3,4])', args: [[1, 2], [3, 4]], expected: 2.5 }
        ],
        hints: [
            "The goal is O(log (m+n)) complexity.",
            "Consider using a binary search approach on the smaller of the two arrays."
        ],
        starterCode: {
            javascript: 'function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n}',
            python: 'def find_median_sorted_arrays(nums1, nums2):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Your code here\n        return 0.0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Your code here\n        return 0.0;\n    }\n};',
            c: 'double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size){\n    // Your code here\n    return 0.0;\n}'
        }
    },
    {
        id: 'longest-substring-without-repeating-characters',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        tags: ['Hash Table', 'String', 'Sliding Window'],
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        fnName: { javascript: 'lengthOfLongestSubstring', python: 'length_of_longest_substring', java: 'lengthOfLongestSubstring', cpp: 'lengthOfLongestSubstring', c: 'lengthOfLongestSubstring' },
        testCases: [
            { input: '("abcabcbb")', args: ["abcabcbb"], expected: 3 },
            { input: '("bbbbb")', args: ["bbbbb"], expected: 1 },
            { input: '("pwwkew")', args: ["pwwkew"], expected: 3 }
        ],
        hints: [
            "Use a sliding window approach with two pointers.",
            "Use a Set or Map to keep track of the characters in the current window."
        ],
        starterCode: {
            javascript: 'function lengthOfLongestSubstring(s) {\n  // Your code here\n}',
            python: 'def length_of_longest_substring(s):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'maximum-subarray',
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        tags: ['Array', 'Dynamic Programming'],
        description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
        fnName: { javascript: 'maxSubArray', python: 'max_sub_array', java: 'maxSubArray', cpp: 'maxSubArray', c: 'maxSubArray' },
        testCases: [
            { input: '([-2,1,-3,4,-1,2,1,-5,4])', args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
            { input: '([1])', args: [[1]], expected: 1 },
            { input: '([5,4,-1,7,8])', args: [[5, 4, -1, 7, 8]], expected: 23 }
        ],
        hints: [
            "This is Kadane's Algorithm.",
            "At each position, decide whether to start a new subarray or extend the previous one."
        ],
        starterCode: {
            javascript: 'function maxSubArray(nums) {\n  // Your code here\n}',
            python: 'def max_sub_array(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'merge-intervals',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        tags: ['Array', 'Sorting'],
        description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
        fnName: { javascript: 'merge', python: 'merge', java: 'merge', cpp: 'merge', c: 'merge' },
        testCases: [
            { input: '([[1,3],[2,6],[8,10],[15,18]])', args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
            { input: '([[1,4],[4,5]])', args: [[[1, 4], [4, 5]]], expected: [[1, 5]] }
        ],
        hints: [
            "Sort the intervals by their start times first.",
            "Compare the current interval's start with the last merged interval's end."
        ],
        starterCode: {
            javascript: 'function merge(intervals) {\n  // Your code here\n}',
            python: 'def merge(intervals):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your code here\n        return new int[][]{};\n    }\n}'
        }
    },
    {
        id: 'rotate-image',
        title: 'Rotate Image',
        difficulty: 'Medium',
        tags: ['Array', 'Math', 'Matrix'],
        description: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). Return modified matrix.',
        fnName: { javascript: 'rotate', python: 'rotate', java: 'rotate', cpp: 'rotate', c: 'rotate' },
        testCases: [
            { input: '([[1,2,3],[4,5,6],[7,8,9]])', args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] }
        ],
        hints: [
            "Try transposing the matrix first (swap matrix[i][j] with matrix[j][i]).",
            "Then reverse each row."
        ],
        starterCode: {
            javascript: 'function rotate(matrix) {\n  // Your code here\n  return matrix;\n}',
            python: 'def rotate(matrix):\n    # Your code here\n    return matrix',
            java: 'class Solution {\n    public void rotate(int[][] matrix) {\n        // Your code here\n    }\n}'
        }
    },
    {
        id: 'search-in-rotated-sorted-array',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        tags: ['Array', 'Binary Search'],
        description: 'Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
        fnName: { javascript: 'search', python: 'search', java: 'search', cpp: 'search', c: 'search' },
        testCases: [
            { input: '([4,5,6,7,0,1,2], 0)', args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
            { input: '([4,5,6,7,0,1,2], 3)', args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 }
        ],
        hints: [
            "Use binary search. At each step, at least one half of the array must be sorted.",
            "Determine which half the target might be in based on the sorted half."
        ],
        starterCode: {
            javascript: 'function search(nums, target) {\n  // Your code here\n}',
            python: 'def search(nums, target):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n}'
        }
    },
    {
        id: 'product-of-array-except-self',
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        tags: ['Array', 'Prefix Sum'],
        description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].',
        fnName: { javascript: 'productExceptSelf', python: 'product_except_self', java: 'productExceptSelf', cpp: 'productExceptSelf', c: 'productExceptSelf' },
        testCases: [
            { input: '([1,2,3,4])', args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
            { input: '([-1,1,0,-3,3])', args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] }
        ],
        hints: [
            "Use prefix and suffix products.",
            "Try calculating the prefix products in one pass and suffix products in another."
        ],
        starterCode: {
            javascript: 'function productExceptSelf(nums) {\n  // Your code here\n}',
            python: 'def product_except_self(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Your code here\n        return new int[]{};\n    }\n}'
        }
    },
    {
        id: 'reverse-integer',
        title: 'Reverse Integer',
        difficulty: 'Medium',
        tags: ['Math'],
        description: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the 32-bit integer range, return 0.',
        fnName: { javascript: 'reverse', python: 'reverse', java: 'reverse', cpp: 'reverse', c: 'reverse' },
        testCases: [
            { input: '(123)', args: [123], expected: 321 },
            { input: '(-123)', args: [-123], expected: -321 },
            { input: '(120)', args: [120], expected: 21 }
        ],
        hints: [
            "Pop digits from x and push them to the result: res = res * 10 + (x % 10).",
            "Be careful with overflow checks (for 32-bit integers)."
        ],
        starterCode: {
            javascript: 'function reverse(x) {\n  // Your code here\n}',
            python: 'def reverse(x):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int reverse(int x) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Monotonic Stack'],
        description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        fnName: { javascript: 'trap', python: 'trap', java: 'trap', cpp: 'trap', c: 'trap' },
        testCases: [
            { input: '([0,1,0,2,1,0,1,3,2,1,2,1])', args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
            { input: '([4,2,0,3,2,5])', args: [[4, 2, 0, 3, 2, 5]], expected: 9 }
        ],
        hints: [
            "For each bar, the amount of water it traps is determined by the minimum of the maximum height on its left and right.",
            "Use two pointers or dynamic programming to store left and right max heights."
        ],
        starterCode: {
            javascript: 'function trap(height) {\n  // Your code here\n}',
            python: 'def trap(height):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int trap(int[] height) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'number-of-islands',
        title: 'Number of Islands',
        difficulty: 'Medium',
        tags: ['Array', 'DFS', 'BFS', 'Matrix'],
        description: 'Given an m x n 2D binary grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
        fnName: { javascript: 'numIslands', python: 'num_islands', java: 'numIslands', cpp: 'numIslands', c: 'numIslands' },
        testCases: [
            {
                input: '([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]])',
                args: [[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]],
                expected: 1
            }
        ],
        hints: [
            "Use Depth First Search (DFS) or Breadth First Search (BFS) to traverse the islands.",
            "When you find a '1', increment the count and mark all connected '1's as visited (e.g., set them to '0')."
        ],
        starterCode: {
            javascript: 'function numIslands(grid) {\n  // Your code here\n}',
            python: 'def num_islands(grid):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Your code here\n        return 0;\n    }\n}'

        }
    },
    {
        id: 'diameter-of-binary-tree',
        title: 'Diameter of Binary Tree',
        difficulty: 'Easy',
        tags: ['Tree', 'DFS', 'Binary Tree'],
        description: 'Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes in a tree.',
        fnName: { javascript: 'diameterOfBinaryTree', python: 'diameter_of_binary_tree', java: 'diameterOfBinaryTree' },
        testCases: [
            { input: '([1,2,3,4,5])', args: [[1, 2, 3, 4, 5]], expected: 3 }
        ],
        hints: [
            "The diameter of a tree is the maximum of (left_height + right_height) across all nodes.",
            "Use recursion to calculate the height of each subtree while updating the global maximum diameter."
        ],
        starterCode: {
            javascript: 'function diameterOfBinaryTree(root) {\n  // Your code here\n}',
            python: 'def diameter_of_binary_tree(root):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int diameterOfBinaryTree(TreeNode root) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'],
        description: 'Given the root of a binary tree, invert the tree, and return its root.',
        fnName: { javascript: 'invertTree', python: 'invert_tree', java: 'invertTree' },
        testCases: [
            { input: '([4,2,7,1,3,6,9])', args: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] }
        ],
        hints: [
            "For each node, swap its left and right children.",
            "Recursively call the function for the subtrees."
        ],
        starterCode: {
            javascript: 'function invertTree(root) {\n  // Your code here\n}',
            python: 'def invert_tree(root):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Your code here\n        return root;\n    }\n}'
        }
    },
    {
        id: 'valid-sudoku',
        title: 'Valid Sudoku',
        difficulty: 'Medium',
        tags: ['Array', 'Hash Table', 'Matrix'],
        description: 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the Sudoku rules.',
        fnName: { javascript: 'isValidSudoku', python: 'is_valid_sudoku', java: 'isValidSudoku' },
        testCases: [
            {
                input: '([["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]])',
                args: [[["5", "3", ".", ".", "7", ".", ".", ".", "."], ["6", ".", ".", "1", "9", "5", ".", ".", "."], [".", "9", "8", ".", ".", ".", ".", "6", "."], ["8", ".", ".", ".", "6", ".", ".", ".", "3"], ["4", ".", ".", "8", ".", "3", ".", ".", "1"], ["7", ".", ".", ".", "2", ".", ".", ".", "6"], [".", "6", ".", ".", ".", ".", "2", "8", "."], [".", ".", ".", "4", "1", "9", ".", ".", "5"], [".", ".", ".", ".", "8", ".", ".", "7", "9"]]],
                expected: true
            }
        ],
        hints: [
            "Use three sets of hash maps or boolean arrays to track number occurrences in rows, columns, and 3x3 subgrids.",
            "The 3x3 subgrid index can be calculated as (row / 3) * 3 + (col / 3)."
        ],
        starterCode: {
            javascript: 'function isValidSudoku(board) {\n  // Your code here\n}',
            python: 'def is_valid_sudoku(board):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean isValidSudoku(char[][] board) {\n        // Your code here\n        return false;\n    }\n}'
        }
    },
    {
        id: 'jump-game',
        title: 'Jump Game',
        difficulty: 'Medium',
        tags: ['Array', 'Greedy', 'Dynamic Programming'],
        description: 'You are given an integer array nums. You are initially positioned at the first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index.',
        fnName: { javascript: 'canJump', python: 'can_jump', java: 'canJump' },
        testCases: [
            { input: '([2,3,1,1,4])', args: [[2, 3, 1, 1, 4]], expected: true },
            { input: '([3,2,1,0,4])', args: [[3, 2, 1, 0, 4]], expected: false }
        ],
        hints: [
            "Use a greedy approach: track the furthest index you can reach so far.",
            "If at any point your current index exceeds the maximum reachable index, return false."
        ],
        starterCode: {
            javascript: 'function canJump(nums) {\n  // Your code here\n}',
            python: 'def can_jump(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean canJump(int[] nums) {\n        // Your code here\n        return false;\n    }\n}'
        }
    },
    {
        id: 'longest-common-prefix',
        title: 'Longest Common Prefix',
        difficulty: 'Easy',
        tags: ['String'],
        description: 'Write a function to find the longest common prefix string amongst an array of strings.',
        fnName: { javascript: 'longestCommonPrefix', python: 'longest_common_prefix', java: 'longestCommonPrefix' },
        testCases: [
            { input: '(["flower","flow","flight"])', args: [["flower", "flow", "flight"]], expected: "fl" },
            { input: '(["dog","racecar","car"])', args: [["dog", "racecar", "car"]], expected: "" }
        ],
        hints: [
            "Sort the array and compare only the first and last strings.",
            "Alternatively, pick the first string as the prefix and repeatedly shorten it while it's not a prefix of the next string."
        ],
        starterCode: {
            javascript: 'function longestCommonPrefix(strs) {\n  // Your code here\n}',
            python: 'def longest_common_prefix(strs):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Your code here\n        return "";\n    }\n}'
        }
    },
    {
        id: 'rotate-array',
        title: 'Rotate Array',
        difficulty: 'Medium',
        tags: ['Array', 'Math', 'Two Pointers'],
        description: 'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.',
        fnName: { javascript: 'rotate', python: 'rotate', java: 'rotate' },
        testCases: [
            { input: '([1,2,3,4,5,6,7], 3)', args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7, 1, 2, 3, 4] }
        ],
        hints: [
            "K might be larger than the array length, so k = k % n.",
            "The entire array can be rotated by reversing it, then reversing the first k elements and the remaining n-k elements."
        ],
        starterCode: {
            javascript: 'function rotate(nums, k) {\n  // Your code here\n}',
            python: 'def rotate(nums, k):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public void rotate(int[] nums, int k) {\n        // Your code here\n    }\n}'
        }
    },
    {
        id: 'house-robber',
        title: 'House Robber',
        difficulty: 'Medium',
        tags: ['Array', 'Dynamic Programming'],
        description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Return the maximum amount of money you can rob tonight without alerting the police.',
        fnName: { javascript: 'rob', python: 'rob', java: 'rob' },
        testCases: [
            { input: '([1,2,3,1])', args: [[1, 2, 3, 1]], expected: 4 },
            { input: '([2,7,9,3,1])', args: [[2, 7, 9, 3, 1]], expected: 12 }
        ],
        hints: [
            "This is a dynamic programming problem: rob[i] = max(rob[i-1], rob[i-2] + current_house).",
            "You only need two variables to keep track of the results for i-1 and i-2 to save space."
        ],
        starterCode: {
            javascript: 'function rob(nums) {\n  // Your code here\n}',
            python: 'def rob(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int rob(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'is-subsequence',
        title: 'Is Subsequence',
        difficulty: 'Easy',
        tags: ['Two Pointers', 'String'],
        description: 'Given two strings s and t, return true if s is a subsequence of t, or false otherwise.',
        fnName: { javascript: 'isSubsequence', python: 'is_subsequence', java: 'isSubsequence' },
        testCases: [
            { input: '("abc", "ahbgdc")', args: ["abc", "ahbgdc"], expected: true },
            { input: '("axc", "ahbgdc")', args: ["axc", "ahbgdc"], expected: false }
        ],
        hints: [
            "Use two pointers, one for each string.",
            "If characters match, move both pointers. If not, only move the pointer for string t."
        ],
        starterCode: {
            javascript: 'function isSubsequence(s, t) {\n  // Your code here\n}',
            python: 'def is_subsequence(s, t):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean isSubsequence(String s, String t) {\n        // Your code here\n        return false;\n    }\n}'
        }
    },
    {
        id: 'coin-change',
        title: 'Coin Change',
        difficulty: 'Medium',
        tags: ['Array', 'Dynamic Programming'],
        description: 'Given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money, return the fewest number of coins that you need to make up that amount.',
        fnName: { javascript: 'coinChange', python: 'coin_change', java: 'coinChange' },
        testCases: [
            { input: '([1,2,5], 11)', args: [[1, 2, 5], 11], expected: 3 },
            { input: '([2], 3)', args: [[2], 3], expected: -1 }
        ],
        hints: [
            "This is a classic change-making problem using dynamic programming.",
            "Create a DP array where dp[i] is the minimum coins needed for amount i."
        ],
        starterCode: {
            javascript: 'function coinChange(coins, amount) {\n  // Your code here\n}',
            python: 'def coin_change(coins, amount):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'group-anagrams',
        title: 'Group Anagrams',
        difficulty: 'Medium',
        tags: ['Hash Table', 'String', 'Sorting'],
        description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
        fnName: { javascript: 'groupAnagrams', python: 'group_anagrams', java: 'groupAnagrams' },
        testCases: [
            { input: '(["eat","tea","tan","ate","nat","bat"])', args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] }
        ],
        hints: [
            "Two strings are anagrams if their sorted versions are identical.",
            "Use a hash map where the sorted string is the key and the value is a list of original strings."
        ],
        starterCode: {
            javascript: 'function groupAnagrams(strs) {\n  // Your code here\n}',
            python: 'def group_anagrams(strs):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}'
        }
    },
    {
        id: 'valid-palindrome-ii',
        title: 'Valid Palindrome II',
        difficulty: 'Easy',
        tags: ['Two Pointers', 'String'],
        description: 'Given a string s, return true if the s can be palindrome after deleting at most one character from it.',
        fnName: { javascript: 'validPalindrome', python: 'valid_palindrome', java: 'validPalindrome' },
        testCases: [
            { input: '("aba")', args: ["aba"], expected: true },
            { input: '("abca")', args: ["abca"], expected: true },
            { input: '("abc")', args: ["abc"], expected: false }
        ],
        hints: [
            "Use the standard two-pointer approach for palindrome checking.",
            "If characters at left and right pointers differ, try skipping either the left or the right character and check the remaining substring."
        ],
        starterCode: {
            javascript: 'function validPalindrome(s) {\n  // Your code here\n}',
            python: 'def valid_palindrome(s):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean validPalindrome(String s) {\n        // Your code here\n        return false;\n    }\n}'
        }
    },
    {
        id: 'missing-positive',
        title: 'First Missing Positive',
        difficulty: 'Hard',
        tags: ['Array', 'Hash Table'],
        description: 'Given an unsorted integer array nums, return the smallest missing positive integer.',
        fnName: { javascript: 'firstMissingPositive', python: 'first_missing_positive', java: 'firstMissingPositive' },
        testCases: [
            { input: '([1,2,0])', args: [[1, 2, 0]], expected: 3 },
            { input: '([3,4,-1,1])', args: [[3, 4, -1, 1]], expected: 2 }
        ],
        hints: [
            "The missing positive integer must be in the range [1, n+1], where n is the array length.",
            "Try to place each number x at its index x-1 if x is positive and within the array range."
        ],
        starterCode: {
            javascript: 'function firstMissingPositive(nums) {\n  // Your code here\n}',
            python: 'def first_missing_positive(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int firstMissingPositive(int[] nums) {\n        // Your code here\n        return 1;\n    }\n}'
        }
    },
    {
        id: 'majority-element',
        title: 'Majority Element',
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table', 'Sorting', 'Greedy'],
        description: 'Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.',
        fnName: { javascript: 'majorityElement', python: 'majority_element', java: 'majorityElement' },
        testCases: [
            { input: '([3,2,3])', args: [[3, 2, 3]], expected: 3 },
            { input: '([2,2,1,1,1,2,2])', args: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 }
        ],
        hints: [
            "Boyer-Moore Voting Algorithm is the most efficient way to solve this in O(n) time and O(1) space.",
            "Maintain a candidate and a count, incrementing or decrementing as you iterate through the array."
        ],
        starterCode: {
            javascript: 'function majorityElement(nums) {\n  // Your code here\n}',
            python: 'def majority_element(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int majorityElement(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'longest-palindromic-substring',
        title: 'Longest Palindromic Substring',
        difficulty: 'Medium',
        tags: ['String', 'Dynamic Programming'],
        description: 'Given a string s, return the longest palindromic substring in s.',
        fnName: { javascript: 'longestPalindrome', python: 'longest_palindrome', java: 'longestPalindrome' },
        testCases: [
            { input: '("babad")', args: ["babad"], expected: "bab" },
            { input: '("cbbd")', args: ["cbbd"], expected: "bb" }
        ],
        hints: [
            "For each character or gap between characters, expand outwards while it's a palindrome.",
            "Alternatively, use Dynamic Programming to track if substring s[i..j] is a palindrome."
        ],
        starterCode: {
            javascript: 'function longestPalindrome(s) {\n  // Your code here\n}',
            python: 'def longest_palindrome(s):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public String longestPalindrome(String s) {\n        // Your code here\n        return "";\n    }\n}'
        }
    },
    {
        id: 'sum-3',
        title: '3Sum',
        difficulty: 'Medium',
        tags: ['Array', 'Two Pointers', 'Sorting'],
        description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
        fnName: { javascript: 'threeSum', python: 'three_sum', java: 'threeSum' },
        testCases: [
            { input: '([-1,0,1,2,-1,-4])', args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] }
        ],
        hints: [
            "Sort the array first to avoid duplicate triplets.",
            "For each element, use two pointers (left and right) on the remaining array to find the other two elements."
        ],
        starterCode: {
            javascript: 'function threeSum(nums) {\n  // Your code here\n}',
            python: 'def three_sum(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}'
        }
    },
    {
        id: 'merge-sorted-array',
        title: 'Merge Sorted Array',
        difficulty: 'Easy',
        tags: ['Array', 'Two Pointers', 'Sorting'],
        description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array.',
        fnName: { javascript: 'merge', python: 'merge', java: 'merge' },
        testCases: [
            { input: '([1,2,3,0,0,0], 3, [2,5,6], 3)', args: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], expected: [1, 2, 2, 3, 5, 6] }
        ],
        hints: [
            "nums1 has enough space at the end to hold elements from nums2.",
            "Try working backwards from the end of both arrays to fill nums1 from largest to smallest."
        ],
        starterCode: {
            javascript: 'function merge(nums1, m, nums2, n) {\n  // Your code here\n}',
            python: 'def merge(nums1, m, nums2, n):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        // Your code here\n    }\n}'
        }
    },
    {
        id: 'best-time-to-buy-and-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        tags: ['Array', 'Dynamic Programming'],
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
        fnName: { javascript: 'maxProfit', python: 'max_profit', java: 'maxProfit' },
        testCases: [
            { input: '([7,1,5,3,6,4])', args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
            { input: '([7,6,4,3,1])', args: [[7, 6, 4, 3, 1]], expected: 0 }
        ],
        hints: [
            "Keep track of the minimum price seen so far.",
            "Calculate the potential profit at each day and update the maximum profit."
        ],
        starterCode: {
            javascript: 'function maxProfit(prices) {\n  // Your code here\n}',
            python: 'def max_profit(prices):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'pascals-triangle',
        title: 'Pascal\'s Triangle',
        difficulty: 'Easy',
        tags: ['Array', 'Dynamic Programming'],
        description: 'Given an integer numRows, return the first numRows of Pascal\'s triangle.',
        fnName: { javascript: 'generate', python: 'generate', java: 'generate' },
        testCases: [
            { input: '(5)', args: [5], expected: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]] }
        ],
        hints: [
            "Each row depends on the previous row.",
            "The element at index j of row i is the sum of elements at index j-1 and j of row i-1."
        ],
        starterCode: {
            javascript: 'function generate(numRows) {\n  // Your code here\n}',
            python: 'def generate(numRows):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<List<Integer>> generate(int numRows) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}'
        }
    },
    {
        id: 'spiral-matrix',
        title: 'Spiral Matrix',
        difficulty: 'Medium',
        tags: ['Array', 'Matrix'],
        description: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
        fnName: { javascript: 'spiralOrder', python: 'spiral_order', java: 'spiralOrder' },
        testCases: [
            { input: '([[1,2,3],[4,5,6],[7,8,9]])', args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] }
        ],
        hints: [
            "Use four boundaries (top, bottom, left, right) to track the spiral traversal.",
            "Move boundary inward after each horizontal or vertical pass."
        ],
        starterCode: {
            javascript: 'function spiralOrder(matrix) {\n  // Your code here\n}',
            python: 'def spiral_order(matrix):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}'
        }
    },
    {
        id: 'set-matrix-zeroes',
        title: 'Set Matrix Zeroes',
        difficulty: 'Medium',
        tags: ['Array', 'Hash Table', 'Matrix'],
        description: 'Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0s. Do it in-place.',
        fnName: { javascript: 'setZeroes', python: 'set_zeroes', java: 'setZeroes' },
        testCases: [
            { input: '([[1,1,1],[1,0,1],[1,1,1]])', args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] }
        ],
        hints: [
            "To do it in-place with O(1) space, use the first row and first column of the matrix to store markers.",
            "Handle the first row and column separately as a special case."
        ],
        starterCode: {
            javascript: 'function setZeroes(matrix) {\n  // Your code here\n  return matrix;\n}',
            python: 'def set_zeroes(matrix):\n    # Your code here\n    return matrix',
            java: 'class Solution {\n    public void setZeroes(int[][] matrix) {\n        // Your code here\n    }\n}'
        }
    },
    {
        id: 'binary-tree-inorder-traversal',
        title: 'Binary Tree Inorder Traversal',
        difficulty: 'Easy',
        tags: ['Tree', 'Stack', 'DFS', 'Binary Tree'],
        description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
        fnName: { javascript: 'inorderTraversal', python: 'inorder_traversal', java: 'inorderTraversal' },
        testCases: [
            { input: '([1,null,2,3])', args: [[1, null, 2, 3]], expected: [1, 3, 2] }
        ],
        hints: [
            "Inorder traversal visits nodes in the order: Left, Root, Right.",
            "Try both a recursive and an iterative (using a stack) approach."
        ],
        starterCode: {
            javascript: 'function inorderTraversal(root) {\n  // Your code here\n}',
            python: 'def inorder_traversal(root):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}'
        }
    },
    {
        id: 'container-with-most-water',
        title: 'Container With Most Water',
        difficulty: 'Medium',
        tags: ['Array', 'Two Pointers', 'Greedy'],
        description: 'Find two lines that together with the x-axis form a container, such that the container contains the most water.',
        fnName: { javascript: 'maxArea', python: 'max_area', java: 'maxArea' },
        testCases: [
            { input: '([1,8,6,2,5,4,8,3,7])', args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 }
        ],
        hints: [
            "Use two pointers, one at each end of the array.",
            "The area is limited by the shorter line. Move the pointer of the shorter line inward to try and find a taller line."
        ],
        starterCode: {
            javascript: 'function maxArea(height) {\n  // Your code here\n}',
            python: 'def max_area(height):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int maxArea(int[] height) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'binary-tree-level-order-traversal',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        tags: ['Tree', 'BFS', 'Binary Tree'],
        description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values. (i.e., from left to right, level by level).',
        fnName: { javascript: 'levelOrder', python: 'level_order', java: 'levelOrder' },
        testCases: [
            { input: '([3,9,20,null,null,15,7])', args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] }
        ],
        hints: [
            "Use a queue to process nodes level by level (Breadth-First Search).",
            "At each level, record the number of nodes currently in the queue to process them as a single level."
        ],
        starterCode: {
            javascript: 'function levelOrder(root) {\n  // Your code here\n}',
            python: 'def level_order(root):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}'
        }
    },
    {
        id: 'lowest-common-ancestor-of-a-binary-tree',
        title: 'Lowest Common Ancestor of a Binary Tree',
        difficulty: 'Medium',
        tags: ['Tree', 'DFS', 'Binary Tree'],
        description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q.',
        fnName: { javascript: 'lowestCommonAncestor', python: 'lowest_common_ancestor', java: 'lowestCommonAncestor' },
        testCases: [
            { input: '([3,5,1,6,2,0,8,null,null,7,4], 5, 1)', args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1], expected: 3 }
        ],
        hints: [
            "If the current node is null or matches either p or q, return the current node.",
            "Recursively search the left and right subtrees. If both return a non-null value, the current node is the LCA."
        ],
        starterCode: {
            javascript: 'function lowestCommonAncestor(root, p, q) {\n  // Your code here\n}',
            python: 'def lowest_common_ancestor(root, p, q):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        // Your code here\n        return root;\n    }\n}'
        }
    },
    {
        id: 'letter-combinations-of-a-phone-number',
        title: 'Letter Combinations of a Phone Number',
        difficulty: 'Medium',
        tags: ['Hash Table', 'String', 'Backtracking'],
        description: 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.',
        fnName: { javascript: 'letterCombinations', python: 'letter_combinations', java: 'letterCombinations' },
        testCases: [
            { input: '("23")', args: ["23"], expected: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"] }
        ],
        hints: [
            "Use a hash map to map each digit to its corresponding letters.",
            "Use backtracking to explore all possible combinations by iterating through the letters for each digit."
        ],
        starterCode: {
            javascript: 'function letterCombinations(digits) {\n  // Your code here\n}',
            python: 'def letter_combinations(digits):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<String> letterCombinations(String digits) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}'
        }
    },
    {
        id: 'generate-parentheses',
        title: 'Generate Parentheses',
        difficulty: 'Medium',
        tags: ['String', 'Backtracking'],
        description: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
        fnName: { javascript: 'generateParenthesis', python: 'generate_parenthesis', java: 'generateParenthesis' },
        testCases: [
            { input: '(3)', args: [3], expected: ["((()))", "(()())", "(())()", "()(())", "()()()"] }
        ],
        hints: [
            "Keep track of the number of open and closed parentheses used so far.",
            "You can add an opening parenthesis if open < n, and a closing one if closed < open."
        ],
        starterCode: {
            javascript: 'function generateParenthesis(n) {\n  // Your code here\n}',
            python: 'def generate_parenthesis(n):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<String> generateParenthesis(int n) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}'
        }
    },
    {
        id: 'word-search',
        title: 'Word Search',
        difficulty: 'Medium',
        tags: ['Array', 'Backtracking', 'Matrix'],
        description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells.',
        fnName: { javascript: 'exist', python: 'exist', java: 'exist' },
        testCases: [
            { input: '([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED")', args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"], expected: true }
        ],
        hints: [
            "Use DFS to explore adjacent cells. Temporarily mark visited cells to avoid reusing them in the same word.",
            "Restore the cell value (backtrack) after exploring all possibilities starting from that cell."
        ],
        starterCode: {
            javascript: 'function exist(board, word) {\n  // Your code here\n}',
            python: 'def exist(board, word):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Your code here\n        return false;\n    }\n}'
        }
    },
    {
        id: 'search-a-2d-matrix',
        title: 'Search a 2D Matrix',
        difficulty: 'Medium',
        tags: ['Array', 'Binary Search', 'Matrix'],
        description: 'Write an efficient algorithm that searches for a value in an m x n matrix. This matrix has the following properties: Integers in each row are sorted from left to right. The first integer of each row is greater than the last integer of the previous row.',
        fnName: { javascript: 'searchMatrix', python: 'search_matrix', java: 'searchMatrix' },
        testCases: [
            { input: '([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3)', args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true }
        ],
        hints: [
            "The matrix can be treated as a single sorted array of length m*n.",
            "Perform binary search on the index range [0, m*n-1]. Map index k back to row k/n and col k%n."
        ],
        starterCode: {
            javascript: 'function searchMatrix(matrix, target) {\n  // Your code here\n}',
            python: 'def search_matrix(matrix, target):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        // Your code here\n        return false;\n    }\n}'
        }
    },
    {
        id: 'find-duplicate-number',
        title: 'Find the Duplicate Number',
        difficulty: 'Medium',
        tags: ['Array', 'Two Pointers', 'Binary Search', 'Bit Manipulation'],
        description: 'Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums, return this repeated number.',
        fnName: { javascript: 'findDuplicate', python: 'find_duplicate', java: 'findDuplicate' },
        testCases: [
            { input: '([1,3,4,2,2])', args: [[1, 3, 4, 2, 2]], expected: 2 }
        ],
        hints: [
            "This can be solved like finding the entry point of a cycle in a linked list (Floyd's Cycle Finding Algorithm).",
            "Alternatively, use binary search on the range [1, n] and count elements <= mid."
        ],
        starterCode: {
            javascript: 'function findDuplicate(nums) {\n  // Your code here\n}',
            python: 'def find_duplicate(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int findDuplicate(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'implement-trie',
        title: 'Implement Trie (Prefix Tree)',
        difficulty: 'Medium',
        tags: ['Hash Table', 'String', 'Design', 'Trie'],
        description: 'A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.',
        fnName: { javascript: 'Trie', python: 'Trie', java: 'Trie' },
        testCases: [
            { input: '(["Trie", "insert", "search", "startsWith"], [[], ["apple"], ["apple"], ["app"]])', args: [["Trie", "insert", "search", "startsWith"], [[], ["apple"], ["apple"], ["app"]]], expected: [null, null, true, true] }
        ],
        hints: [
            "Each node in the trie should have a map or array of 26 children (for lowercase letters) and a boolean flag indicating the end of a word.",
            "To insert or search, traverse down the tree character by character."
        ],
        starterCode: {
            javascript: 'class Trie {\n    constructor() {\n        // Initialize your trie here\n    }\n    \n    insert(word) {\n        // Your code here\n    }\n    \n    search(word) {\n        // Your code here\n    }\n    \n    startsWith(prefix) {\n        // Your code here\n    }\n}',
            python: 'class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word: str) -> None:\n        pass\n    def search(self, word: str) -> bool:\n        pass\n    def startsWith(self, prefix: str) -> bool:\n        pass',
            java: 'class Trie {\n    public Trie() {\n    }\n    public void insert(String word) {\n    }\n    public boolean search(String word) {\n    }\n    public boolean startsWith(String prefix) {\n    }\n}'
        }
    },
    {
        id: 'min-stack',
        title: 'Min Stack',
        difficulty: 'Medium',
        tags: ['Stack', 'Design'],
        description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
        fnName: { javascript: 'MinStack', python: 'MinStack', java: 'MinStack' },
        testCases: [
            { input: '(["MinStack","push","push","push","getMin","pop","top","getMin"], [[],[-2],[0],[-3],[],[],[],[]])', args: [["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], [[], [-2], [0], [-3], [], [], [], []]], expected: [null, null, null, null, -3, null, 0, -2] }
        ],
        hints: [
            "Use an auxiliary stack to keep track of the minimum values at each point.",
            "When pushing a value, also push currentMin(val, auxStack.top()) into the auxiliary stack."
        ],
        starterCode: {
            javascript: 'class MinStack {\n    constructor() {\n        // Initialize your stack here\n    }\n    push(val) {\n        // Your code here\n    }\n    pop() {\n        // Your code here\n    }\n    top() {\n        // Your code here\n    }\n    getMin() {\n        // Your code here\n    }\n}',
            python: 'class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        pass\n    def getMin(self) -> int:\n        pass',
            java: 'class MinStack {\n    public MinStack() {\n    }\n    public void push(int val) {\n    }\n    public void pop() {\n    }\n    public int top() {\n    }\n    public int getMin() {\n    }\n}'
        }
    },
    {
        id: 'daily-temperatures',
        title: 'Daily Temperatures',
        difficulty: 'Medium',
        tags: ['Array', 'Stack', 'Monotonic Stack'],
        description: 'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
        fnName: { javascript: 'dailyTemperatures', python: 'daily_temperatures', java: 'dailyTemperatures' },
        testCases: [
            { input: '([73,74,75,71,69,72,76,73])', args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] }
        ],
        hints: [
            "Use a monotonic decreasing stack to store indices of temperatures.",
            "Iterate through temperatures; while current temp > stack.top temp, pop from stack and calculate the difference in indices."
        ],
        starterCode: {
            javascript: 'function dailyTemperatures(temperatures) {\n  // Your code here\n}',
            python: 'def daily_temperatures(temperatures):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        // Your code here\n        return new int[]{};\n    }\n}'
        }
    },
    {
        id: 'merge-k-sorted-lists',
        title: 'Merge k Sorted Lists',
        difficulty: 'Hard',
        tags: ['Linked List', 'Divide and Conquer', 'Heap', 'Merge Sort'],
        description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
        fnName: { javascript: 'mergeKLists', python: 'merge_k_lists', java: 'mergeKLists' },
        testCases: [
            { input: '([[1,4,5],[1,3,4],[2,6]])', args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] }
        ],
        hints: [
            "Use a Min-Heap (Priority Queue) to efficiently find the smallest node across all k lists.",
            "Alternatively, use a divide and conquer approach, merging pairs of lists repeatedly."
        ],
        starterCode: {
            javascript: 'function mergeKLists(lists) {\n  // Your code here\n}',
            python: 'def merge_k_lists(lists):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Your code here\n        return null;\n    }\n}'
        }
    },
    {
        id: 'word-break',
        title: 'Word Break',
        difficulty: 'Medium',
        tags: ['Hash Table', 'String', 'Dynamic Programming', 'Trie', 'Memoization'],
        description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
        fnName: { javascript: 'wordBreak', python: 'word_break', java: 'wordBreak' },
        testCases: [
            { input: '("leetcode", ["leet","code"])', args: ["leetcode", ["leet", "code"]], expected: true }
        ],
        hints: [
            "Use dynamic programming. dp[i] is true if the substring s[0...i] can be segmented.",
            "For each i, check if any j < i exists such that dp[j] is true and s[j...i] is in the dictionary."
        ],
        starterCode: {
            javascript: 'function wordBreak(s, wordDict) {\n  // Your code here\n}',
            python: 'def word_break(s, wordDict):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        // Your code here\n        return false;\n    }\n}'
        }
    },
    {
        id: 'longest-increasing-subsequence',
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        tags: ['Array', 'Binary Search', 'Dynamic Programming'],
        description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
        fnName: { javascript: 'lengthOfLIS', python: 'length_of_lis', java: 'lengthOfLIS' },
        testCases: [
            { input: '([10,9,2,5,3,7,101,18])', args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 }
        ],
        hints: [
            "Use DP where dp[i] is the length of the LIS ending at index i.",
            "For a faster O(n log n) solution, maintain a sorted tail array and use binary search to determine where to place the current number."
        ],
        starterCode: {
            javascript: 'function lengthOfLIS(nums) {\n  // Your code here\n}',
            python: 'def length_of_lis(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int lengthOfLIS(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'permutations',
        title: 'Permutations',
        difficulty: 'Medium',
        tags: ['Array', 'Backtracking'],
        description: 'Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.',
        fnName: { javascript: 'permute', python: 'permute', java: 'permute' },
        testCases: [
            { input: '([1,2,3])', args: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] }
        ],
        hints: [
            "Use backtracking to build permutations character by character.",
            "Use a boolean array or a set to keep track of which numbers are already included in the current permutation."
        ],
        starterCode: {
            javascript: 'function permute(nums) {\n  // Your code here\n}',
            python: 'def permute(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}'
        }
    },
    {
        id: 'combinations',
        title: 'Combinations',
        difficulty: 'Medium',
        tags: ['Backtracking'],
        description: 'Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n].',
        fnName: { javascript: 'combine', python: 'combine', java: 'combine' },
        testCases: [
            { input: '(4, 2)', args: [4, 2], expected: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]] }
        ],
        hints: [
            "Use backtracking. Start from the current number and explore combinations by choosing the next number from the remaining range.",
            "Once you have k numbers in your combination, record it and backtrack."
        ],
        starterCode: {
            javascript: 'function combine(n, k) {\n  // Your code here\n}',
            python: 'def combine(n, k):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<List<Integer>> combine(int n, int k) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}'
        }
    },
    {
        id: 'kth-largest-element-in-an-array',
        title: 'Kth Largest Element in an Array',
        difficulty: 'Medium',
        tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap', 'Quickselect'],
        description: 'Given an integer array nums and an integer k, return the kth largest element in the array.',
        fnName: { javascript: 'findKthLargest', python: 'find_kth_largest', java: 'findKthLargest' },
        testCases: [
            { input: '([3,2,1,5,6,4], 2)', args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 }
        ],
        hints: [
            "Use a Min-Heap of size k to find the kth largest element in O(n log k) time.",
            "Alternatively, use the Quickselect algorithm for an average O(n) time complexity."
        ],
        starterCode: {
            javascript: 'function findKthLargest(nums, k) {\n  // Your code here\n}',
            python: 'def find_kth_largest(nums, k):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'find-peak-element',
        title: 'Find Peak Element',
        difficulty: 'Medium',
        tags: ['Array', 'Binary Search'],
        description: 'A peak element is an element that is strictly greater than its neighbors. Given an integer array nums, find a peak element, and return its index.',
        fnName: { javascript: 'findPeakElement', python: 'find_peak_element', java: 'findPeakElement' },
        testCases: [
            { input: '([1,2,3,1])', args: [[1, 2, 3, 1]], expected: 2 }
        ],
        hints: [
            "Think about binary search. If nums[mid] < nums[mid+1], a peak must exist in the right half.",
            "Otherwise, a peak must exist in the left half (including mid)."
        ],
        starterCode: {
            javascript: 'function findPeakElement(nums) {\n  // Your code here\n}',
            python: 'def find_peak_element(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int findPeakElement(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'non-overlapping-intervals',
        title: 'Non-overlapping Intervals',
        difficulty: 'Medium',
        tags: ['Array', 'Greedy', 'Sorting'],
        description: 'Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
        fnName: { javascript: 'eraseOverlapIntervals', python: 'erase_overlap_intervals', java: 'eraseOverlapIntervals' },
        testCases: [
            { input: '([[1,2],[2,3],[3,4],[1,3]])', args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1 }
        ],
        hints: [
            "Sort the intervals by their end times.",
            "Always pick the interval that ends earliest to leave more room for subsequent intervals."
        ],
        starterCode: {
            javascript: 'function eraseOverlapIntervals(intervals) {\n  // Your code here\n}',
            python: 'def erase_overlap_intervals(intervals):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public int eraseOverlapIntervals(int[][] intervals) {\n        // Your code here\n        return 0;\n    }\n}'
        }
    },
    {
        id: 'decode-string',
        title: 'Decode String',
        difficulty: 'Medium',
        tags: ['String', 'Stack', 'Recursion'],
        description: 'Given an encoded string, return its decoded string. The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is being repeated exactly k times.',
        fnName: { javascript: 'decodeString', python: 'decode_string', java: 'decodeString' },
        testCases: [
            { input: '("3[a]2[bc]")', args: ["3[a]2[bc]"], expected: "aaabcbc" }
        ],
        hints: [
            "Use two stacks: one for numbers and one for strings (or current decoded characters).",
            "When you see a '[', push the current string and number onto stacks. When you see a ']', pop them and build the repeated string."
        ],
        starterCode: {
            javascript: 'function decodeString(s) {\n  // Your code here\n}',
            python: 'def decode_string(s):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public String decodeString(String s) {\n        // Your code here\n        return "";\n    }\n}'
        }
    },
    {
        id: 'subsets',
        title: 'Subsets',
        difficulty: 'Medium',
        tags: ['Array', 'Backtracking', 'Bit Manipulation'],
        description: 'Given an integer array nums of unique elements, return all possible subsets (the power set).',
        fnName: { javascript: 'subsets', python: 'subsets', java: 'subsets' },
        testCases: [
            { input: '([1,2,3])', args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] }
        ],
        hints: [
            "Use backtracking: at each step, you can either include or exclude the current element.",
            "Alternatively, use bit manipulation. Each subset can be represented by a binary number of length n."
        ],
        starterCode: {
            javascript: 'function subsets(nums) {\n  // Your code here\n}',
            python: 'def subsets(nums):\n    # Your code here\n    pass',
            java: 'class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}'
        }
    }
];

export default CHALLENGES;
