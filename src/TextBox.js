import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import domToImg from 'dom-to-image';
import './style.css';

const WIDTH = 280;
const MAX_FONT_SIZE = 50;
const MIN_FONT_SIZE = 20;

const delay = time => new Promise(res => setTimeout(res, time));

const clamp = (min, max) => n => Math.max(Math.min(n, max), min);

const clampFont = clamp(MAX_FONT_SIZE, MIN_FONT_SIZE);

const getFontSize = text => clampFont((WIDTH * 7) / text.length);

const Wrapper = styled.div`
  font-size: ${({ fontSize }) => fontSize}px;
  width: ${WIDTH}px;
  height: ${WIDTH}px;
  text-align: center;
  font-family: 'main-font';
  padding: 10px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class extends PureComponent {
  static propTypes = {
    children: PropTypes.string.isRequired,
  }

  async componentDidMount() {
    if (!this.div) {
      return console.error("No div :/");
    }

    await delay(Math.random() * 2000 + 1000);
    const dataUrl = await domToImg.toPng(this.div, { cacheBust: true });
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    this.props.addImageToZip(blob, `${this.props.children}.png`);

    var img = new Image();
    img.src = dataUrl;
    document.body.appendChild(img);
  }

  render() {
    return (
      <Wrapper innerRef={div => this.div = div} fontSize={getFontSize(this.props.children)}>
        <span>{this.props.children}</span>
      </Wrapper>
    );
  }
}
