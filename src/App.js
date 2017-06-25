import React from 'react';
import styled from 'styled-components';
import JSZip from 'jszip';
import { compose, withState, withHandlers } from 'recompose';
import TextBox from './TextBox';


const AppWrapper = styled.div`
  margin: 1rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  background-color: #ddd;
`;

const zip = new JSZip();
const images = zip.folder('images');
let count = 0;

const addImageToZip = total => async (image, name) => {
  ++count;
  images.file(name, image);
  if (count >= total) {
    const z = await zip.generateAsync({ type: 'blob' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(z);
    a.download = 'out.zip';
    a.click();
  }
};

const enhance = compose(
  withState('text', 'setText', ''),
  withState('phrases', 'setPhrases', []),
  withHandlers({
    onTextChange: props => e => props.setText(e.target.value),
    onSubmit: props => () => props.setPhrases(
      props.text
        .trim()
        .split('\n')
        .map(t => t.trim())
        .filter(t => t),
    ),
  }),
);

const TextArea = styled.textarea`
  width: 100%;
  margin: 1rem;
`;
const Button = styled.button`
  padding: 0.25rem;
  width: 100%;
  margin: 1rem;
  font-size: 2rem;
  cursor: pointer;
`;

const App = props => (
  <AppWrapper>
    <TextArea onChange={props.onTextChange} cols={50} rows={20} placeholder="Put the phrases here. One phrase per line! :D" />
    <Button onClick={props.onSubmit}>Let's go!</Button>
    {props.phrases.map(p => <TextBox key={p} addImageToZip={addImageToZip(props.phrases.length)}>{p}</TextBox>)}
  </AppWrapper>
);

export default enhance(App);
