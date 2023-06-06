import iframeResize from 'iframe-resizer/js/iframeResizer'
import React, { useEffect, useImperativeHandle, useRef } from 'react'
import warning from 'warning'

import filterIframeAttribs from './filter-iframe-attribs'

const IframeResizer = ({ title = 'iframe', forwardRef, ...rest }) => {
  const iframeProps = filterIframeAttribs(rest)
  const iframeRef = useRef(null)

  const onClose = () => {
    warning(
      !iframeRef.current,
      `[iframeSizerReact][${
        iframeRef && iframeRef.current && iframeRef.current.id
      }] Close event ignored, to remove the iframe update your React component`
    )
    return !iframeRef.current
  }

  // This hook is only run once, as once iframeResizer is bound, it will
  // deal with changes to the element and does not need recalling
  useEffect(() => {
    const iframe = iframeRef.current

    iframeResize({ ...rest, onClose }, iframe)

    return () => iframe.iFrameResizer && iframe.iFrameResizer.removeListeners()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(forwardRef, () => ({
    resize: () => iframeRef.current.iFrameResizer.resize(),
    moveToAnchor: (anchor) =>
      iframeRef.current.iFrameResizer.moveToAnchor(anchor),
    sendMessage: (message, targetOrigin) => {
      iframeRef.current.iFrameResizer.sendMessage(message, targetOrigin)
    },
  }))

  return <iframe title={title} {...iframeProps} ref={iframeRef} />
}

export default IframeResizer
