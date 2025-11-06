declare module '*.png' {
  const content: number;
  export default content;
}
declare module '*.jpg' {
  const content: number;
  export default content;
}
declare module '*.jpeg' {
  const content: number;
  export default content;
}
declare module '*.gif' {
  const content: number;
  export default content;
}
declare module '*.svg' {
  import * as React from 'react';
  const content: React.FC<any>;
  export default content;
}