import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
THREE.ColorManagement.enabled = false
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js'

import { Raycaster } from 'three/src/core/Raycaster.js'
var renderInt = 0


// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */

const scene = new THREE.Scene()
const scene2 = new THREE.Scene()

//scenes for the 6 buttons (resume, github, projects, contact me)
const resumeScene = new THREE.Scene()
const githubScene = new THREE.Scene()
const projectsScene = new THREE.Scene()
const contactScene = new THREE.Scene()

//PLACE WHERE I WILL MAKE MY CONTACT ME FORM, need to figure out how to send and receive emails. Server?
const p = document.createElement('p')
p.textContent = 'Contact me through the form below!'
const contactMeParagraph = new CSS2DObject(p)

contactMeParagraph.element.style.color = 'white'
contactMeParagraph.position.set(-1.5, 10, 0)
contactScene.add(contactMeParagraph)

const form = document.createElement('form')
const firstName = document.createElement('input')
firstName.setAttribute('type', 'text')
firstName.setAttribute('placeholder', 'Enter your first name')
firstName.setAttribute('id', 'firstName')
firstName.style.position = 'absolute'
firstName.style.left = '190px'
firstName.style.top = '50px'


const lastName = document.createElement('input')
lastName.setAttribute('type', 'text')
lastName.setAttribute('placeholder', 'Enter your last name')
lastName.setAttribute('id', 'lastName')
lastName.style.position = 'absolute'
lastName.style.left = '190px'
lastName.style.top = '100px'

const email = document.createElement('input')
email.setAttribute('type', 'email')
email.setAttribute('placeholder', 'Enter your email')
email.style.position = 'absolute'
email.style.left = '190px'
email.style.top = '150px'


const message = document.createElement('textarea')
message.setAttribute('placeholder', 'Enter your message here')
message.setAttribute('rows', '10')
message.setAttribute('cols', '30')
message.style.position = 'absolute'
message.style.left = '190px'
message.style.top = '200px'

const submitButton = document.createElement('button')
submitButton.setAttribute('type', 'submit')
submitButton.setAttribute('onclick', 'sendContact()')
submitButton.textContent = 'Submit'
submitButton.style.position = 'absolute'
submitButton.style.left = '190px'
submitButton.style.top = '400px'


form.appendChild(firstName)
form.appendChild(lastName)
form.appendChild(email)
form.appendChild(message)
form.appendChild(submitButton)

const contactMeForm = new CSS2DObject(form)
contactMeForm.position.set(10, 10, 0)
contactScene.add(contactMeForm)


//figure out how to link this javascript to a server that can send the emails

// //create a raycaster
const raycaster = new  THREE.Raycaster()

/**
 * Fonts
 */
const fontLoader = new FontLoader()

//currentIntersect
let currentIntersect = null

//mouse
const mouse = new THREE.Vector2()

//find the center of the screen
const axesHelper = new THREE.AxesHelper(5)
//contactScene.add(axesHelper)


fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {

        //loading the photo of my face
        const textureLoader = new THREE.TextureLoader()
        const facePhotoTexture = textureLoader.load('/photos/Photo.png')
        
        const planeGeometry = new THREE.PlaneGeometry(5, 5, 1, 1) //10, 10, 1, 1
        const planeMaterial = new THREE.MeshBasicMaterial({
            map: facePhotoTexture
        })
        const facePlane = new THREE.Mesh(planeGeometry, planeMaterial)
        facePlane.rotation.y = Math.PI
        facePlane.position.x = -2
        facePlane.position.y = 7.5
        facePlane.position.z = 0

        
        planeMaterial.side = THREE.DoubleSide //makes it visible on both sides of the image


        //animating the facePhoto so that it's not a static boring image
        setInterval(() => {
            facePlane.position.x += 0.03
            if (facePlane.position.x > 9) {
                facePlane.position.x = -11
            }
        }, 100)

        scene2.add(facePlane)

        //ADDING STARS TO SCENE 1 BACKGROUND
        const parameters2 = {}
        parameters2.count = 15000 //20000
        parameters2.size = 0.09 //0.06
        parameters2.radius = 100
        parameters2.branches = 3
        parameters2.spin = 2
        parameters2.randomness = 0.4 //0.2
        parameters2.randomnessPower = 3
        parameters2.insideColor = '#ff6030'
        parameters2.outsideColor = '#1b3984'

        let geometry2 = null
        let material2 = null
        let points2 = null

        const generateGalaxy2 = () => {
            //destroy old galaxy
            if (points2 !== null) {
                geometry2.dispose()
                material2.dispose()
                scene.add(points2)
            }

            //geometry
            geometry2 = new THREE.BufferGeometry()
            const positions2 = new Float32Array(parameters2.count * 3)
            const colors2 = new Float32Array(parameters2.count * 3)
            
            const colorInside2 = new THREE.Color(parameters2.insideColor)
            const colorOutside2 = new THREE.Color(parameters2.outsideColor)

            for (let i = 0; i < parameters2.count; i++) {
                const i3 = i * 1
                const radius2 = Math.random() * parameters2.radius
                const spinAngle2 = radius2 * parameters2.spin
                const branchAngle2 = (i % parameters2.branches) / parameters2.branches * Math.PI * 2
                const randomX2 = Math.pow(Math.random(), parameters2.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters2.randomness * radius2
                const randomY2 = Math.pow(Math.random(), parameters2.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters2.randomness * radius2
                const randomZ2 = Math.pow(Math.random(), parameters2.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters2.randomness * radius2

                positions2[i3] = Math.cos(branchAngle2 + spinAngle2) * radius2 + randomX2
                positions2[i3 + 1] = randomY2
                positions2[i3 + 2] = Math.sin(branchAngle2 + spinAngle2) * radius2 + randomZ2

                //color
                const mixedColor2 = colorInside2.clone()
                mixedColor2.lerp(colorOutside2, radius2 / parameters2.radius)

                colors2[i3] = mixedColor2.r
                colors2[i3 + 1] = mixedColor2.g
                colors2[i3 + 2] = mixedColor2.b

            }

            geometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3))
            geometry2.setAttribute('color', new THREE.BufferAttribute(colors2, 3))

            //material
            material2 = new THREE.PointsMaterial({
                size: parameters2.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true
            })

            
            setInterval(() => {
                material2.size = Math.random() * 0.08
            }, Math.random() * 5000)

            //points
            points2 = new THREE.Points(geometry2, material2)
            scene.add(points2)

        }

        generateGalaxy2()

        //TITLE TEXT
        const textGeometry = new TextGeometry(
            'Welcome to my portfolio!',
            {
                font: font,
                size: 2.0,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        const textMaterial = new THREE.MeshBasicMaterial()
        const titleText = new THREE.Mesh(textGeometry, textMaterial)
        textMaterial.color.setHex(0x90EE90)
        titleText.rotation.y = Math.PI
        titleText.position.x = 14 //-14

        setInterval(() => {
            textMaterial.color.setHex(Math.random() * 0xffffff)
        }, 2000)
        
        scene.add(titleText)
        
        //SUBTITLE TEXT OF MY NAME
        const textGeometry2 = new TextGeometry(
            'by: Jeongbin Son',
            {font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        const textMaterial2 = new THREE.MeshBasicMaterial()
        const nameText = new THREE.Mesh(textGeometry2, textMaterial2)
        nameText.rotation.y = Math.PI
        nameText.position.x = 1 
        nameText.position.y = - 2.5

        scene.add(nameText)
        const textGeometry3 = new TextGeometry(
            'Click here to explore the website!', {
                font: font,
                size: 1.0,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        const textMaterial3 = new THREE.MeshBasicMaterial()
        const buttonOne = new THREE.Mesh(textGeometry3, textMaterial3)
        textMaterial3.color.setHex(0x90EE90)

        //use the raycaster to detect when we click
        window.addEventListener('click', (event) => {
            
            mouse.x = (event.clientX / sizes.width) * 2 - 1
            mouse.y = - (event.clientY / sizes.height) * 2 + 1

            //update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera)

            //calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects([buttonOne])
            
            if (intersects.length > 0) {
                scene.visible = false
                resumeScene.visible = false
                scene2.visible = true
                renderInt = 1
                contactMeParagraph.element.style.display = 'none'
                
            }
        })
        buttonOne.rotation.y = Math.PI
        buttonOne.position.x = 8 
        buttonOne.position.y = - 5

        scene.add(buttonOne)

        //About me
        const textGeometry5 = new TextGeometry(
            'About me', {
                font: font,
                size: 1.0,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5

            }
        )
        const textMaterial5 = new THREE.MeshBasicMaterial()
        const aboutMeText = new THREE.Mesh(textGeometry5, textMaterial5)
        textMaterial5.color.setHex(0x90EE90)
        aboutMeText.rotation.y = Math.PI
        aboutMeText.position.x = 3
        aboutMeText.position.y = 12


        scene2.add(aboutMeText)

        //ABOUT ME PARAGRAPH

        const textGeometry6 = new TextGeometry(
            'Hi, I am a 3rd year international student studying Computer Science at the University of Alabama. \n\nI am interested in app development, web development, and many more. ', {
                font: font,
                size: 0.8,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0, //0.02
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        const textMaterial6 = new THREE.MeshBasicMaterial()
        const aboutMeParagraph = new THREE.Mesh(textGeometry6, textMaterial6)
        textMaterial6.color.setHex(0xFFFFFF)
        aboutMeParagraph.rotation.y = Math.PI
        aboutMeParagraph.position.x = 6
        aboutMeParagraph.position.y = 2


        setInterval(() => {
            aboutMeParagraph.position.x += 0.03 //0.12
            if (aboutMeParagraph.position.x > 25) {
                aboutMeParagraph.position.x = -11
            }
        }, 100)


        scene2.add(aboutMeParagraph)

        /**
         * Galaxy
         */

        const parameters = {}
        parameters.count = 8000 //9000
        parameters.size = 0.1 //0.12
        parameters.radius = 20
        parameters.branches = 2 //2
        parameters.spin = 2 //2
        parameters.randomness = 0.12 // 0.1
        parameters.randomnessPower = 6 //3 or 6
        parameters.insideColor = '#ff6030'
        parameters.outsideColor = '#1b3984'
        

        let geometry = null
        let material = null
        let points = null

        const generateGalaxy = () => {
            //destroy old galaxy
            if (points !== null) {
                geometry.dispose()
                material.dispose()
                scene2.remove(points)
            }

            //geometry
            geometry = new THREE.BufferGeometry()
            const positions = new Float32Array(parameters.count * 3)
            const colors = new Float32Array(parameters.count * 3)

            const colorInside = new THREE.Color(parameters.insideColor)
            const colorOutside = new THREE.Color(parameters.outsideColor)

            for (let i = 0; i < parameters.count; i++) {
                const i3 = i * 3
                const radius = Math.random() * parameters.radius
                const spinAngle = radius * parameters.spin
                const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
                const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 1.0 ? 1 : -1) * parameters.randomness * radius
                const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 1.0 ? 1 : -1) * parameters.randomness * radius
                const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 1.0 ? 1 : -1) * parameters.randomness * radius

                
                positions[i3] = -(Math.sin(branchAngle + spinAngle) * radius + randomZ)
                positions[i3 + 1] = Math.cos(branchAngle + spinAngle) * radius + randomX
                positions[i3 + 2] = randomY
                

                //color
                const mixedColor = colorInside.clone()
                mixedColor.lerp(colorOutside, radius / parameters.radius)

                colors[i3] = mixedColor.r
                colors[i3 + 1] = mixedColor.g
                colors[i3 + 2] = mixedColor.b
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
            

            //material
            material = new THREE.PointsMaterial({
                size: parameters.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true
            })


            //points
            points = new THREE.Points(geometry, material)
            points.position.z = 1
            scene2.add(points)

            //make the galaxy spin
            setInterval(() => {
                points.rotation.z += 0.003
            }
            , 100)
            
        }

        generateGalaxy()
        
        //6 buttons for links, Resume, LinkedIn, Github, Projects, Weebly, Contact me
        const textGeometry7 = new TextGeometry(
            'Resume', {
                font: font,
                size: 0.8,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0, //0.02
                bevelOffset: 0, 
                bevelSegments: 5

            }
        )
        const textMaterial7 = new THREE.MeshBasicMaterial()
        const resumeButton = new THREE.Mesh(textGeometry7, textMaterial7)
        textMaterial7.color.setHex(0xADD8E6)
        resumeButton.rotation.y = Math.PI
        resumeButton.position.x = 11
        resumeButton.position.y = -6

        scene2.add(resumeButton)

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / sizes.width) * 2 - 1
            mouse.y = - (event.clientY / sizes.height) * 2 + 1

            raycaster.setFromCamera(mouse, camera)

            const intersects = raycaster.intersectObjects([resumeButton])
            if (intersects.length > 0) {
                scene2.visible = false
                resumeScene.visible = true
                renderInt = 2
                contactMeParagraph.element.style.display = 'none'
                
            }
        })

        const textGeometry8 = new TextGeometry(
            'LinkedIn', {
                font: font,
                size: 0.8,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0, //0.02
                bevelOffset: 0,
                bevelSegments: 5

            }
        )
        const textMaterial8 = new THREE.MeshBasicMaterial()
        const linkedInButton = new THREE.Mesh(textGeometry8, textMaterial8)
        textMaterial8.color.setHex(0xADD8E6)
        linkedInButton.rotation.y = Math.PI
        linkedInButton.position.x = 2
        linkedInButton.position.y = -6

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / sizes.width) * 2 - 1
            mouse.y = - (event.clientY / sizes.height) * 2 + 1

            raycaster.setFromCamera(mouse, camera)

            //const intersects2 = raycaster.intersectObjects(scene2.children)
            const intersects = raycaster.intersectObjects([linkedInButton])
            if (intersects.length > 0) {
                scene2.visible = false
                window.open('https://www.linkedin.com/in/jeongbin-son/')
                scene2.visible = true
                contactMeParagraph.element.style.display = 'none'
            }
            
        })

        scene2.add(linkedInButton)


        const textGeometry9 = new TextGeometry(
            'Github', {
                font: font,
                size: 0.8,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0, //0.02
                bevelOffset: 0,
                bevelSegments: 5

            }
        )
        const textMaterial9 = new THREE.MeshBasicMaterial()
        const githubButton = new THREE.Mesh(textGeometry9, textMaterial9)
        textMaterial9.color.setHex(0xADD8E6)
        githubButton.rotation.y = Math.PI
        githubButton.position.x = -7
        githubButton.position.y = -6

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / sizes.width) * 2 - 1
            mouse.y = - (event.clientY / sizes.height) * 2 + 1

            raycaster.setFromCamera(mouse, camera)

            const intersects = raycaster.intersectObjects([githubButton])
            if (intersects.length > 0) {
                scene2.visible = false
                window.open('https://github.com/brian419')
                scene2.visible = true
                contactMeParagraph.element.style.display = 'none'
            }
        })


        scene2.add(githubButton)

        const textGeometry10 = new TextGeometry(
            'Projects', {
                font: font,
                size: 0.8,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0, //0.02
                bevelOffset: 0,
                bevelSegments: 5

            }
        )
        const textMaterial10 = new THREE.MeshBasicMaterial()
        const projectsButton = new THREE.Mesh(textGeometry10, textMaterial10)
        textMaterial10.color.setHex(0xADD8E6)
        projectsButton.rotation.y = Math.PI
        projectsButton.position.x = 11
        projectsButton.position.y = -10

        scene2.add(projectsButton)

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / sizes.width) * 2 - 1
            mouse.y = - (event.clientY / sizes.height) * 2 + 1
            
            raycaster.setFromCamera(mouse, camera)

            const intersects = raycaster.intersectObjects([projectsButton])
            if (intersects.length > 0) {
                scene2.visible = false
                projectsScene.visible = true
                renderInt = 4
                contactMeParagraph.element.style.display = 'none'
            }
        })


        const textGeometry11 = new TextGeometry(
            'Weebly', {
                font: font,
                size: 0.8,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0, //0.02
                bevelOffset: 0,
                bevelSegments: 5

            }
        )
        const textMaterial11 = new THREE.MeshBasicMaterial()
        const weeblyButton = new THREE.Mesh(textGeometry11, textMaterial11)
        textMaterial11.color.setHex(0xADD8E6)
        weeblyButton.rotation.y = Math.PI
        weeblyButton.position.x = 2
        weeblyButton.position.y = -10

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / sizes.width) * 2 - 1 
            mouse.y = - (event.clientY / sizes.height) * 2 + 1

            raycaster.setFromCamera(mouse, camera)

            const intersects = raycaster.intersectObjects([weeblyButton])
            if (intersects.length > 0) {
                scene2.visible = false
                window.open('https://jeongbinson.weebly.com/')
                scene2.visible = true
                contactMeParagraph.element.style.display = 'none'
            }
        })

        scene2.add(weeblyButton)

        const textGeometry12 = new TextGeometry(
            'Contact', {
                font: font,
                size: 0.8,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0, //0.02
                bevelOffset: 0,
                bevelSegments: 5

            }
        )
        const textMaterial12 = new THREE.MeshBasicMaterial()
        const contactMeButton = new THREE.Mesh(textGeometry12, textMaterial12)
        textMaterial12.color.setHex(0xADD8E6)
        contactMeButton.rotation.y = Math.PI
        contactMeButton.position.x = -7
        contactMeButton.position.y = -10

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / sizes.width) * 2 - 1
            mouse.y = - (event.clientY / sizes.height) * 2 + 1

            raycaster.setFromCamera(mouse, camera)

            const intersects = raycaster.intersectObjects([contactMeButton])
            if (intersects.length > 0) {
                scene2.visible = false
                contactScene.visible = true
                renderInt = 5
                
            }
        })

        scene2.add(contactMeButton)

        //WHAT IS IN RESUME SCENE
        //loading a picture of my resume"
        const textureLoader2 = new THREE.TextureLoader()
        const resumeTextureP1 = textureLoader2.load('/photos/CS Resume Version 1 PNG_Page_1.png')

        const planeGeometry2 = new THREE.PlaneGeometry(10, 10, 1, 1)
        const planeMaterial2 = new THREE.MeshBasicMaterial({
            map: resumeTextureP1
        })

        const resumePlaneP1 = new THREE.Mesh(planeGeometry2, planeMaterial2)
        resumePlaneP1.rotation.y = Math.PI
        resumePlaneP1.position.x = 5
        resumePlaneP1.position.y = 0

        planeMaterial2.side = THREE.DoubleSide

        resumeScene.add(resumePlaneP1)

        const textureLoader3 = new THREE.TextureLoader()
        const resumeTextureP2 = textureLoader3.load('/photos/CS Resume Version 1 PNG_Page_2.png')

        const planeGeometry3 = new THREE.PlaneGeometry(10, 10, 1, 1)
        const planeMaterial3 = new THREE.MeshBasicMaterial({
            map: resumeTextureP2
        })

        const resumePlaneP2 = new THREE.Mesh(planeGeometry3, planeMaterial3)
        resumePlaneP2.rotation.y = Math.PI
        resumePlaneP2.position.x = -5
        resumePlaneP2.position.y = 0

        planeMaterial3.side = THREE.DoubleSide

        resumeScene.add(resumePlaneP2)

        //WHAT IS IN PROJECTS SCENE
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0x90EE90,
            wireframe: false
        })

        //SCORE COUNTER
        //make a text that can auto update itself with the new scores as it comes

        var gameScore = 0
        const textGeometry4 = new TextGeometry(
            'Score: ' + gameScore, {
                font: font,
                size: 0.8,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )

        const textMaterial4 = new THREE.MeshBasicMaterial()
        const scoreText = new THREE.Mesh(textGeometry4, textMaterial4)
        textMaterial4.color.setHex(0x90EE90)
        scoreText.rotation.y = Math.PI
        scoreText.position.x = 1.8
        scoreText.position.y = 10


        projectsScene.add(scoreText)


        //CHARACTER FOR THE GAME

        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cube.position.x = 0
        cube.position.y = 0
        cube.position.z = 0

        projectsScene.add(cube)

        //add 3D keyboard controls to the cube
        window.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'ArrowUp':
                    cube.position.z -= 0.1
                    break
                case 'ArrowDown':
                    cube.position.z += 0.1
                    break
                case 'ArrowLeft':
                    cube.position.x += 0.1
                    break
                case 'ArrowRight':
                    cube.position.x -= 0.1
                    break
                
            }
            switch (event.key) {
                case 'w':
                    cube.position.z += 0.1
                    break
                case 's':
                    cube.position.z -= 0.1
                    break
                case 'a':
                    cube.position.x += 0.1
                    break
                case 'd':
                    cube.position.x -= 0.1
                    break
                case 'Shift':
                    cube.position.y -= 0.1
                    break
                case ' ':
                    cube.position.y += 0.1
                    break
                
            }
        })

        const sphereGeometry2 = new THREE.SphereGeometry(1, 32, 32)
        const sphereMaterial2 = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: false
        })

        const textGeometry13 = new TextGeometry(
            'Click here to start the game!', {
                font: font,
                size: 1.0,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        const textMaterial13 = new THREE.MeshBasicMaterial()
        const startGameButton = new THREE.Mesh(textGeometry13, textMaterial13)
        textMaterial13.color.setHex(0x90EE90)
        startGameButton.rotation.y = Math.PI
        startGameButton.position.x = 8
        startGameButton.position.y = -8

        projectsScene.add(startGameButton)

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / sizes.width) * 2 - 1
            mouse.y = - (event.clientY / sizes.height) * 2 + 1

            raycaster.setFromCamera(mouse, camera)

            const intersects = raycaster.intersectObjects([startGameButton])
            if (intersects.length > 0) {
                for (let i = 0; i < 3; i++) {
                    const sphereTargets = new THREE.Mesh(sphereGeometry2, sphereMaterial2)
                    sphereTargets.position.x = (Math.random() - 0.5) * 10
                    sphereTargets.position.y = (Math.random() - 0.5) * 10
                    sphereTargets.position.z = (Math.random() - 0.5) * 10
                    
                    projectsScene.add(sphereTargets)
                    /**
                     * Collision
                     */
                    



                
                    setInterval(() => {
                        sphereTargets.position.x -= 0.1
                        if (sphereTargets.position.x < -10) {
                            sphereTargets.position.x = 10
                        }
                    }
                    , 100)
                }

                //remove the startgame button once the game starts
                startGameButton.visible = false

                //update the score based on time
                setInterval(() => {
                    gameScore += 1
                    scoreText.geometry = new TextGeometry(
                        'Score: ' + gameScore, {
                            font: font,
                            size: 0.8,
                            height: 0.2,
                            curveSegments: 12,
                            bevelEnabled: true,
                            bevelThickness: 0.01,
                            bevelSize: 0.01,
                            bevelOffset: 0,
                            bevelSegments: 5
                        }
                    )
                }, 1000)
            }
        })


        //WHAT IS IN CONTACT SCENE
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        })

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphere.position.x = 0
        sphere.position.y = 0
        sphere.position.z = 0

        contactScene.add(sphere)
    }
)

/**
 * Loaders
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/environmentMaps/2/px.png',
    '/environmentMaps/2/nx.png',
    '/environmentMaps/2/py.png',
    '/environmentMaps/2/ny.png',
    '/environmentMaps/2/pz.png',
    '/environmentMaps/2/nz.png'
    
])

scene.environment = environmentMap
scene.background = environmentMap

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)

camera.position.x = 0
camera.position.y = 0
camera.position.z = -20
scene.add(camera)
scene2.add(camera)
resumeScene.add(camera)
githubScene.add(camera)
projectsScene.add(camera)
contactScene.add(camera)


//Controls (for orbital controls)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true //kind of like friction, makes the movement smoother



window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// //handle fullscreen
// window.addEventListener('dblclick', () => {
//     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
//     if (!fullscreenElement) {
//         if (canvas.requestFullscreen) {
//             canvas.requestFullscreen()
//         }
//         else if (canvas.webkitRequestFullscreen) {
//             canvas.webkitRequestFullscreen()
//         }
//     }
//     else {
//         if (document.exitFullscreen) {
//             document.exitFullscreen()
//         }
//         else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen()
//         }
//     }
// })

//cursor
const cursor = {
    x: 0,
    y: 0
}

//handle mouse movement for camera
window.addEventListener('mousemove', (event) => {

    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(sizes.width, sizes.height)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
labelRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(labelRenderer.domElement)



//for the three js colors
renderer.outputColorSpace = THREE.LinearSRGBColorSpace


const clock = new THREE.Clock()

//update the position of the camera using tick 
const tick = (buttonOne) => {

    const elapsedTime = clock.getElapsedTime()

    const rayOrigin = new THREE.Vector3(- 3, 0, 0)
    const rayDirection = new THREE.Vector3(1, 0, 0)
    rayDirection.normalize()

    raycaster.set(rayOrigin, rayDirection)

    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [buttonOne]
    //const intersects = raycaster.intersectObjects(objectsToTest)

    //Update controls (for orbital controls)
    controls.update()


    if (renderInt == 0) {
        renderer.render(scene, camera)
        
        
    }
    
    else if (renderInt == 1) {
        renderer.render(scene2, camera)
    }

    else if (renderInt == 2) {
        
        renderer.render(resumeScene, camera)
    }
    else if (renderInt == 3) {
        renderer.render(githubScene, camera)
    }
    else if (renderInt == 4) {
        renderer.render(projectsScene, camera)
    }
    else if (renderInt == 5) {
        //controls.enabled = false
        renderer.render(contactScene, camera)
        labelRenderer.render(contactScene, camera)
    }


    //call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()