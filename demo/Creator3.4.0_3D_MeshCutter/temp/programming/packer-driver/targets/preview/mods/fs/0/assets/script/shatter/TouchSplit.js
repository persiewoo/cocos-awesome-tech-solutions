System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, Component, Node, Vec3, Mat4, systemEvent, SystemEventType, CameraComponent, geometry, PhysicsSystem, utils, ColliderComponent, BoxColliderComponent, MeshColliderComponent, RigidBodyComponent, MeshRenderer, Mesh, FastHull, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _temp, _crd, ccclass, property, TouchSplit;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfFastHull(extras) {
    _reporterNs.report("FastHull", "./FastHull", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
      Mat4 = _cc.Mat4;
      systemEvent = _cc.systemEvent;
      SystemEventType = _cc.SystemEventType;
      CameraComponent = _cc.CameraComponent;
      geometry = _cc.geometry;
      PhysicsSystem = _cc.PhysicsSystem;
      utils = _cc.utils;
      ColliderComponent = _cc.ColliderComponent;
      BoxColliderComponent = _cc.BoxColliderComponent;
      MeshColliderComponent = _cc.MeshColliderComponent;
      RigidBodyComponent = _cc.RigidBodyComponent;
      MeshRenderer = _cc.MeshRenderer;
      Mesh = _cc.Mesh;
    }, function (_unresolved_2) {
      FastHull = _unresolved_2.FastHull;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "dddd955hFBCoq28a1uknU0e", "TouchSplit", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TouchSplit", TouchSplit = (_dec = ccclass('TouchSplit'), _dec2 = property(CameraComponent), _dec(_class = (_class2 = (_temp = class TouchSplit extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "cameraCom", _descriptor, this);

          _initializerDefineProperty(this, "cutOnce", _descriptor2, this);

          _defineProperty(this, "addRig", false);

          _defineProperty(this, "raycastCount", 256);

          _defineProperty(this, "started", false);

          _defineProperty(this, "startPos", new Vec3());

          _defineProperty(this, "endPos", new Vec3());

          _defineProperty(this, "near", 0);

          _defineProperty(this, "physicsSystem", PhysicsSystem.instance);
        }

        start() {
          this.startPos = new Vec3(0, 0, 0);
          this.endPos = new Vec3(0, 0, 0);
          systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
          systemEvent.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);
        }

        onTouchStart(touch) {
          this.near = this.cameraCom.near;
          this.startPos.set(touch.getLocationX(), touch.getLocationY(), this.near);
          this.started = true;
        }

        onTouchEnd(touch) {
          var _this = this;

          if (!this.started) return;
          this.started = false;
          this.endPos.set(touch.getLocationX(), touch.getLocationY(), this.near);
          var line = Vec3.subtract(new Vec3(), this.cameraCom.screenToWorld(this.endPos), this.cameraCom.screenToWorld(this.startPos));
          var splitMeshs = [];

          var _loop = function _loop(i) {
            var pos = Vec3.lerp(new Vec3(), _this.startPos, _this.endPos, i / _this.raycastCount);

            var ray = _this.cameraCom.screenPointToRay(pos.x, pos.y);

            if (_this.physicsSystem.raycast(ray)) {
              var results = _this.physicsSystem.raycastResults;
              results.forEach(result => {
                var splitPlane = geometry.plane.fromNormalAndPoint(new geometry.plane(), Vec3.cross(new Vec3(), line, ray.d).normalize(), result.hitPoint);
                var splitNode = result.collider.node;
                var splitMesh = {
                  splitNode: splitNode,
                  plane: splitPlane
                };

                if (!splitMeshs.some(splitMesh => splitMesh.splitNode == splitNode)) {
                  splitMeshs.push(splitMesh);
                }
              });
            }
          };

          for (var i = 0; i < this.raycastCount; i++) {
            _loop(i);
          }

          for (var _i = 0, l = splitMeshs.length; _i < l; _i++) {
            this.splitMesh(splitMeshs[_i].splitNode, splitMeshs[_i].plane);
          }
        }

        splitMesh(splitNode, plane) {
          var meshRender = splitNode.getComponent(MeshRenderer);
          var modelMesh = meshRender === null || meshRender === void 0 ? void 0 : meshRender.mesh;
          var mesh = utils.readMesh(modelMesh);
          mesh.minPos = modelMesh.minPosition;
          mesh.maxPos = modelMesh.maxPosition; // let splitSize = Vec3.subtract(new Vec3(), mesh.maxPos as Vec3, mesh.minPos as Vec3);

          var splitCenter = Vec3.add(new Vec3(), mesh.maxPos, mesh.minPos).multiplyScalar(1 / 2);
          var splitMaterial = meshRender === null || meshRender === void 0 ? void 0 : meshRender.sharedMaterial;
          var splitCollider = splitNode.getComponent(ColliderComponent);
          var hull = new (_crd && FastHull === void 0 ? (_reportPossibleCrUseOfFastHull({
            error: Error()
          }), FastHull) : FastHull)(mesh);
          var localPoint = Vec3.transformMat4(new Vec3(), plane.n.multiplyScalar(plane.d), Mat4.invert(new Mat4(), splitNode.worldMatrix));
          var localNormal = Vec3.transformMat4(new Vec3(), plane.n, Mat4.invert(new Mat4(), splitNode.getWorldRS()));
          localNormal.normalize();
          var hullArray = hull.Split(localPoint, localNormal, true);
          hullArray.forEach((meshData, index) => {
            var mesh = utils.createMesh(meshData, new Mesh(), {
              calculateBounds: true
            });
            ;
            var node = new Node();
            var model = node.addComponent(MeshRenderer);
            model.mesh = mesh;
            model.setMaterial(splitMaterial, 0);
            node.setScale(splitNode.scale);
            node.setRotation(splitNode.rotation);
            node.setParent(this.node.parent);

            if (!this.cutOnce) {
              if (splitCollider instanceof MeshColliderComponent) {
                var colliderComponent = node.addComponent(MeshColliderComponent);
                colliderComponent.mesh = mesh;
              } else if (splitCollider instanceof BoxColliderComponent) {
                var _colliderComponent = node.addComponent(BoxColliderComponent);

                _colliderComponent.shape.setCenter(splitCenter);
              }
            }

            if (this.addRig) {
              node.addComponent(RigidBodyComponent);
            } else {
              if (index == 0) {
                node.setPosition(Vec3.transformMat4(new Vec3(), localNormal, Mat4.invert(new Mat4(), splitNode.getWorldRS())).multiply(splitNode.scale).multiplyScalar(0.2).add(splitNode.position));
              } else {
                node.setPosition(Vec3.transformMat4(new Vec3(), Vec3.negate(new Vec3(), localNormal), Mat4.invert(new Mat4(), splitNode.getWorldRS())).multiply(splitNode.scale).multiplyScalar(0.2).add(splitNode.position));
              }
            }
          });

          if (hullArray.length > 0) {
            splitNode.destroy();
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cameraCom", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cutOnce", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=TouchSplit.js.map