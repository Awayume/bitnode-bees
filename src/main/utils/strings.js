// SPDX-FileCopyrightText: 2023 Awayume <dev@awayume.jp>
// SPDX-License-Identifier: APGL-3.0-only

/**
 * Add indents to string.
 * @param {string} [text] - The text to process.
 * @param {number} [depth] - Indentation depth.
 * @return {string}
 */
exports.addIndent = (text, depth) => {
  let i_text = (str => {
    text.split('\n').forEach(v => {
      str += `${' '.repeat(depth)}${v}\n`
    });
    return str.slice(0, -1);
  })('');
  return i_text;
};
