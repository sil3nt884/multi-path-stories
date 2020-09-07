module.exports = {

  extends: 'standard',
  rules: {
    'operator-linebreak': 0,
    'space-before-function-paren': ['off'],
    'no-mixed-operators': ['warn', {
      groups: [
        ['+', '-', '*', '/', '%', '**']
      ]
    }]
  }
}
