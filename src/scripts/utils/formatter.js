export const showFormattedDate = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const dateObject = typeof date === 'string' ? new Date(date) : date;

  return dateObject.toLocaleDateString('en-US', options);
};

export const formatTime = (date) => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
  };

  const dateObject = typeof date === 'string' ? new Date(date) : date;
  return dateObject.toLocaleTimeString('en-US', options);
};

export const formatShortDate = (date) => {
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  const dateObject = typeof date === 'string' ? new Date(date) : date;
  return dateObject.toLocaleDateString('en-US', options);
};

class Formatter {
  static indentCode(code, spaces = 2) {
    const lines = code.split('\n');
    let indentLevel = 0;
    const formattedLines = lines.map(line => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      const indentedLine = ' '.repeat(indentLevel * spaces) + trimmedLine;

      if (trimmedLine.endsWith('{')) {
        indentLevel++;
      }

      return indentedLine;
    });

    return formattedLines.join('\n');
  }
}

export default Formatter;