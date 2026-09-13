Small compilers make a good place to learn how a language becomes a program.

## Why build it

The goal was to make each stage visible: tokens become a syntax tree, the tree is checked, and a small target program is emitted.

## What changed

The implementation favors clear passes over aggressive optimization. Each pass has a small contract, which makes it easier to inspect failures and adjust the language without losing the overall shape.
