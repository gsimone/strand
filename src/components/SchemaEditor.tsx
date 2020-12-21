import * as React from "react";
import { JsonEditor as Editor } from "jsoneditor-react";
import { motion } from 'framer-motion'

import { useLocation, useRoute } from 'wouter';
import clsx from "clsx";
import toast from "react-hot-toast";

import ace from "brace";
import "brace/mode/json";
import "brace/theme/dracula";

import Ajv from "ajv";
import "jsoneditor-react/es/editor.min.css";

import jsonSchemaSchema from '../schema.json'

import { useStore } from "../store";

const ajv = new Ajv({ allErrors: true, verbose: true });

/* Animation settings */
const container = {
  visible: {
    transition: {
      when: "beforeChildren",
    },
  },
  hidden: {
    transition: {
      when: "afterChildren",
    },
  },
}

const background = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}

const modal = {
  visible: { opacity: 1, scale: 1, y: 0, z: 1, transition: {
    when: "beforeChildren",
    type: "tween",
    ease: "backInOut"
  }, },
  hidden: { opacity: 0, scale: .85, y: 20, z: 1, transition: {
    when: "afterChildren",
  }, },
}

const modalContent = {
  visible: { y: 0, opacity: 1, z: 1 },
  hidden: { y: 10, opacity: 0, z: 1 }
}


function SchemaEditor({ id, useSchema }) {

  const name = useSchema(schema => schema.jsonSchema.title)
  const jsonSchema = useSchema((state) => state.jsonSchema);
  const setSchema = useSchema(state => state.set)

  const editorRef = React.useRef(null);

  React.useEffect(() => {
    if (editorRef.current) {
      // @ts-ignore
      editorRef.current.jsonEditor.set(jsonSchema);
    }
  }, [jsonSchema]);

  const [touched, setTouched] = React.useState(false)
  const [error, setError] = React.useState(false)

  const handleChange = React.useCallback(() => {
    const _editor = editorRef.current! as any
    setTouched(true)

    if (_editor.err) { 
      setError(true)
    } else { 
      setError(false)
    }

    ajv.validateSchema(_editor.jsonEditor.get())
    if (ajv.errors) {
      setError(true)
    }

  }, [setTouched, setError]);

  // routing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLocation] = useLocation()
  const backLink = `/nodes/${id}`

  const handleClose = React.useCallback(() => {

    if (touched) {
      if (window.confirm("Close without saving?")) {
        setLocation(backLink)
      }
    } else {
      setLocation(backLink)
    }
    
  }, [touched, setLocation, backLink])

  const handleSave = React.useCallback(() => {

    const _editor = editorRef.current! as any 
    
    if (error) {
      window.alert("You can't save an invalid schema.")
      return
    }

    if (!touched) { 
      setLocation(backLink)
      return
    }

    try {
      setSchema(_editor.jsonEditor.get())
      toast.success('Successfully saved new schema!')
      
      setLocation(backLink)
    } catch (err) {
      toast.error('Successfully toasted!')
    }

  }, [error, touched, setLocation, setSchema, backLink])

  return (
    <motion.div initial="hidden" animate="visible" className="fixed z-20 inset-0 overflow-y-auto" variants={container}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <motion.div
          className="fixed inset-0"
          aria-hidden="true"
          variants={background}
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black" style={{ opacity: .8 }}></div>
        </motion.div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        
        <motion.div
          className="inline-block align-bottom bg-gray-800 text-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl  sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          variants={modal}
        >
          <motion.div variants={modalContent}>
            <h4 className="font-bold">{name}</h4>
            <h2 className="text-2xl font-bold">Edit schema</h2>
            <div className="mt-3 sm:mt-5">
              <div className="mt-2" onKeyUp={handleChange}>
                <Editor
                  htmlElementProps={{
                    style: {
                      height: 500,
                    },
                  }}
                  ref={editorRef}
                  key={id}
                  ace={ace}
                  value={jsonSchema}
                  ajv={ajv}
                  schema={jsonSchemaSchema}
                  theme="ace/theme/dracula"
                  mode={Editor.modes.code}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-5 sm:mt-6 flex items-center justify-end space-x-4">
              {/* <div>
                Status: {error ? "Error" : "Valid"}
              </div> */}

              <button 
                onClick={handleClose}
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-transparent text-base font-medium text-white hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                Close
              </button>
              
              <button
                onClick={handleSave}
                disabled={error}
                type="button"
                className={clsx("inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm", error && "opacity-25 cursor-not-allowed")}
              >
                Save and go back
              </button>
            </div>
          </motion.div>
          
        </motion.div>
    
      </div>
    </motion.div>
  );
}

function SchemaEditorModal() {
  const [match, params] = useRoute('/nodes/:id/schema')
  const useSchema = useStore(store => store.schemas.get(params!.id))

  if (typeof useSchema === "undefined") return null;

  return match ? <SchemaEditor id={params!.id} useSchema={useSchema} /> : null
}

export default SchemaEditorModal;
