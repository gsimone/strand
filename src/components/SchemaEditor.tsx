import * as React from "react";
import { JsonEditor as Editor } from "jsoneditor-react";
import {motion} from 'framer-motion'

import ace from "brace";
import "brace/mode/json";
import "brace/theme/dracula";

import Ajv from "ajv";

import "jsoneditor-react/es/editor.min.css";
import { useStore } from "../store";
import { Link, useLocation, useRoute } from 'wouter';

const ajv = new Ajv({ allErrors: true, verbose: true });

function SchemaEditor({ id }) {
  const useNode = useStore((store) => store.nodes.get(id))!;
  const useSchema = useStore((store) => store.schemas.get(id))!;

  const {name} = useNode()
  
  const jsonSchema = useSchema((state) => state.jsonSchema);
  const editorRef = React.useRef();

  React.useEffect(() => {
    if (editorRef.current) {
      // @ts-ignore
      editorRef.current.jsonEditor.set(jsonSchema);
    }
  }, [jsonSchema]);

  const handleChange = React.useCallback((newValue) => {
  }, []);

  /* Animations */
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

  // routing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLocation] = useLocation()
  const backLink = `/nodes/${id}`

  return (
    <motion.div initial="hidden" animate="visible" className="fixed z-20 inset-0 overflow-y-auto" variants={container}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <motion.div
          className="fixed inset-0"
          aria-hidden="true"
          variants={background}
          onClick={() => setLocation(backLink)}
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
              <div className="mt-2">
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
                  theme="ace/theme/dracula"
                  mode={Editor.modes.code}
                  onChange={handleChange}
                  on
                />
              </div>
            </div>
            <div className="mt-5 sm:mt-6 flex items-center justify-end space-x-4">
              <div>
                Status: Valid
              </div>
              
              <Link href={backLink}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  >
                    Save and go back
                  </button>
                </a>
              </Link>
            </div>
          </motion.div>
          
        </motion.div>
    
      </div>
    </motion.div>
  );
}

function SchemaEditorModal() {
  const id = "dull-zebra-38";
  const [match, params] = useRoute('/nodes/:id/schema')
  const useNode = useStore((store) => store.nodes.get(id));

  if (typeof useNode === "undefined") return null;

  return match ? <SchemaEditor id={params!.id} /> : null
}

export default SchemaEditorModal;
